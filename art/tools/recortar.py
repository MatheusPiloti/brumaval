#!/usr/bin/env python3
"""Acha cada desenho numa folha gerada por IA, seja qual for a ordem, e monta a folha do jogo a partir de uma lista de quadros escolhidos.

  python3 art/tools/recortar.py listar <folha.png> <saida_contato.png>
      tira o fundo (branco ou magenta, ligado à borda), acha as linhas e os desenhos e salva uma prancha numerada L<linha>.<n>

  python3 art/tools/recortar.py montar <folha.png> <chave> <q> <altura> <linhas>
      <linhas> = linhas da folha do jogo separadas por ';', cada uma com os quadros escolhidos separados por ',' ("3.1,3.2,...");
      um quadro com '~' na frente sai espelhado. Gera art/sprites/<chave>_<tipo>.png (tipo = 'hero' com 7 linhas, 'side' com 3, 'fb' com 4).
"""
import sys, pathlib, json, re
import numpy as np
from PIL import Image, ImageDraw
from collections import deque

ROOT = pathlib.Path(__file__).resolve().parents[2]

def remove_bg(im):
    a = np.array(im.convert('RGBA')).astype(int); H, W = a.shape[:2]
    if (a[..., 3] < 10).mean() > 0.2: return a[..., 3] > 128, a
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    corner = np.median(np.concatenate([a[0, :, :3], a[-1, :, :3], a[:, 0, :3], a[:, -1, :3]]), axis=0)
    dist = np.abs(a[..., :3] - corner).sum(2)
    bgish = dist < 60
    if corner[0] > 170 and corner[2] > 170 and corner[1] < 120: bgish |= (r > 150) & (b > 150) & (r - g > 90) & (b - g > 90)
    seen = np.zeros((H, W), bool); q = deque()
    for x in range(W):
        for y in (0, H - 1):
            if bgish[y, x]: seen[y, x] = True; q.append((y, x))
    for y in range(H):
        for x in (0, W - 1):
            if bgish[y, x] and not seen[y, x]: seen[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            Y, X = y + dy, x + dx
            if 0 <= Y < H and 0 <= X < W and not seen[Y, X] and bgish[Y, X]: seen[Y, X] = True; q.append((Y, X))
    fg = ~seen; a[..., 3] = np.where(fg, 255, 0); return fg, a

def find(fg):
    rows = fg.sum(1) > 1; bands = []; s = None
    for y, v in enumerate(list(rows) + [False]):
        if v and s is None: s = y
        if not v and s is not None:
            if y - s > 12: bands.append((s, y))
            s = None
    out = []
    for (y0, y1) in bands:
        occ = fg[y0:y1].sum(0) > 0; segs = []; s = None
        for x, v in enumerate(list(occ) + [False]):
            if v and s is None: s = x
            if not v and s is not None:
                if x - s > 6: segs.append([s, x])
                s = None
        merged = []
        for sg in segs:                                            # junta pedacinhos colados (espada, efeito)
            if merged and sg[0] - merged[-1][1] < 4: merged[-1][1] = sg[1]
            else: merged.append(sg)
        if merged:                                                  # separa desenhos grudados (rastro de espada, efeito) em partes iguais
            med = float(np.median([x1 - x0 for x0, x1 in merged])); sp = []
            for (x0, x1) in merged:
                k = int(round((x1 - x0) / med)) if (x1 - x0) > 1.6 * med else 1
                for i in range(k): sp.append([x0 + (x1 - x0) * i // k, x0 + (x1 - x0) * (i + 1) // k])
            merged = sp
        fr = []
        for (x0, x1) in merged:
            ys = np.where(fg[y0:y1, x0:x1].any(1))[0]; fr.append((x0, y0 + ys.min(), x1, y0 + ys.max() + 1, y1))
        out.append(fr)
    return out

def listar(src, dst):
    im = Image.open(src); fg, a = remove_bg(im); F = find(fg)
    img = Image.fromarray(a.astype(np.uint8)); bg = Image.new('RGBA', img.size, (60, 80, 60, 255)); bg.alpha_composite(img); d = ImageDraw.Draw(bg)
    for li, row in enumerate(F, 1):
        for fi, (x0, y0, x1, y1, bb) in enumerate(row, 1):
            d.rectangle([x0, y0, x1, y1], outline=(255, 220, 0)); d.text((x0 + 2, y0 + 2), f'{li}.{fi}', fill=(255, 255, 255))
    bg.save(dst); print(json.dumps([[f'{li}.{fi} {x1-x0}x{y1-y0}' for fi, (x0, y0, x1, y1, bb) in enumerate(row, 1)] for li, row in enumerate(F, 1)]))

def clean_edges(A):
    # tira os pixels claros que sobraram do fundo na borda e escurece o contorno
    for _ in range(2):
        op = A[..., 3] > 0; H, W = op.shape; pad = np.pad(op, 1); inner = pad[:-2, 1:-1] & pad[2:, 1:-1] & pad[1:-1, :-2] & pad[1:-1, 2:]
        edge = op & ~inner; mn = A[..., :3].min(2); mx = A[..., :3].max(2)
        A[..., 3][edge & (mn > 185) & (mx - mn < 40)] = 0
    op = A[..., 3] > 0; pad = np.pad(op, 1); inner = pad[:-2, 1:-1] & pad[2:, 1:-1] & pad[1:-1, :-2] & pad[1:-1, 2:]; edge = op & ~inner
    light = A[..., :3].astype(int).sum(2) > 200; A[edge & light, :3] = (36, 20, 12)
    return A

def montar(src, key, q, height, spec):
    im = Image.open(src); fg, a = remove_bg(im); F = find(fg); img = Image.fromarray(a.astype(np.uint8))
    lines = [[t.strip() for t in L.split(',') if t.strip()] for L in spec.split(';')]
    kind = {7: 'hero', 3: 'side', 4: 'fb'}[len(lines)]
    def get(tok):
        flip = tok.startswith('~'); li, fi = map(int, tok.lstrip('~').split('.')); return F[li - 1][fi - 1], flip
    ref_h = np.median([get(t)[0][3] - get(t)[0][1] for t in lines[0]]); s = height / ref_h
    Y = 100 if q >= 112 else 58
    sheet = Image.new('RGBA', (q * 6, q * len(lines)), (0, 0, 0, 0))
    for r, L in enumerate(lines):
        for c, tok in enumerate(L[:6]):
            (x0, y0, x1, y1, bb), flip = get(tok)
            crop = img.crop((x0, y0, x1, y1)); w = max(1, round(crop.width * s)); h = max(1, round(crop.height * s))
            A = np.array(crop.resize((w, h), Image.NEAREST)); al = np.array(crop.resize((w, h), Image.BOX))[..., 3]; A[..., 3] = np.where(al > 110, 255, 0)
            A = clean_edges(A)
            fr = Image.fromarray(A)
            if flip: fr = fr.transpose(Image.FLIP_LEFT_RIGHT)
            ox = c * q + q // 2 - fr.width // 2; oy = r * q + Y - fr.height
            ox = max(c * q, min(ox, c * q + q - fr.width)); oy = max(r * q, oy)
            sheet.alpha_composite(fr, (ox, oy))
    out = ROOT / 'art' / 'sprites' / f'{key}_{kind}.png'
    sheet.quantize(colors=96, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).save(out, optimize=True)
    import importlib.util; spec_ = importlib.util.spec_from_file_location('fs', str(ROOT / 'art' / 'tools' / 'fazer_sprite.py')); m_ = importlib.util.module_from_spec(spec_); spec_.loader.exec_module(m_); m_.register(key, q, kind)
    print('ok', out.relative_to(ROOT), sheet.size, 'escala %.3f' % s); return kind

if __name__ == '__main__':
    if sys.argv[1] == 'listar': listar(sys.argv[2], sys.argv[3])
    else: montar(sys.argv[2], sys.argv[3], int(sys.argv[4]), float(sys.argv[5]), sys.argv[6])
