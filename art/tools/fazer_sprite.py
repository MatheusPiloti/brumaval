#!/usr/bin/env python3
"""Converte uma folha gerada por IA na folha do jogo e registra a criatura no jogo.

Uso: python3 art/tools/fazer_sprite.py <origem.png|webp> <chave> <side|fb> <q> <largura> [voa]

  side = folha de lado: linha 1 andando (6), linha 2 ataque (4), linha 3 morte (4)
  fb   = folha de frente e costas: andando de frente (6), andando de costas (6), ataque de frente (4), ataque de costas (4)
  q    = tamanho do quadro no jogo (64 monstros, 112 chefes)
  largura = largura da criatura no jogo, em pixels

A origem pode ter fundo transparente ou fundo magenta liso (#FF00FF).
Gera art/sprites/<chave>_<side|fb>.png e atualiza a lista IMG_ART em src/game.html e mmo/client/game.html.
"""
import sys, re, json, pathlib
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
ROWS = {'side': [6, 4, 4], 'fb': [6, 6, 4, 4]}

def mask_of(a):
    if a.shape[2] == 4 and (a[..., 3] < 10).mean() > 0.2:      # fundo transparente
        return a[..., 3] > 128
    r, g, b = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int)
    mag = ((r > 170) & (b > 170) & (g < 120)) | ((r - g > 110) & (b - g > 110) & (r > 150) & (b > 150))
    return ~mag

def bands(fg, n, min_h=30):
    rows = fg.sum(1) > 2; out = []; s = None
    for y, v in enumerate(rows):
        if v and s is None: s = y
        if not v and s is not None:
            if y - s >= min_h: out.append([s, y])
            s = None
    if s is not None and len(rows) - s >= min_h: out.append([s, len(rows)])
    while len(out) > n:                                           # junta faixas muito próximas (efeitos soltos)
        gaps = [out[i + 1][0] - out[i][1] for i in range(len(out) - 1)]; i = int(np.argmin(gaps)); out[i] = [out[i][0], out[i + 1][1]]; del out[i + 1]
    return out

def cuts(fg_band, n):
    occ = fg_band.sum(0); xs = np.where(occ > 0)[0]
    if len(xs) == 0: return []
    x0, x1 = xs[0], xs[-1] + 1; w = (x1 - x0) / n; res = [x0]
    for i in range(1, n):
        ideal = x0 + i * w; lo, hi = int(ideal - w * 0.3), int(ideal + w * 0.3)
        seg = occ[lo:hi]; res.append(lo + int(np.argmin(seg)))
    res.append(x1); return [(res[i], res[i + 1]) for i in range(n)]

def main():
    src, key, kind, q, tw = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), float(sys.argv[5])
    fly = len(sys.argv) > 6 and sys.argv[6] == 'voa'
    im = Image.open(src).convert('RGBA'); a = np.array(im); fg = mask_of(a)
    a[..., 3] = np.where(fg, 255, 0); im = Image.fromarray(a)
    nrows = ROWS[kind]; B = bands(fg, len(nrows))
    if len(B) != len(nrows): raise SystemExit(f'esperava {len(nrows)} linhas, achei {len(B)}')
    frames = []
    for r, (y0, y1) in enumerate(B):
        for (x0, x1) in cuts(fg[y0:y1], nrows[r]):
            sub = fg[y0:y1, x0:x1]; ys, xs = np.where(sub)
            if len(xs) == 0: frames.append(None); continue
            frames.append((r, x0 + xs.min(), y0 + ys.min(), x0 + xs.max() + 1, y0 + ys.max() + 1, y1))
    W1 = [f[3] - f[1] for f in frames if f and f[0] == 0]; H1 = [f[4] - f[2] for f in frames if f and f[0] == 0]
    Y = 100 if q >= 112 else 58; ground = Y - 8 if fly else Y
    s = min(tw / float(np.median(W1)), (ground - 4) / float(np.median(H1)))
    sheet = Image.new('RGBA', (q * 6, q * len(nrows)), (0, 0, 0, 0)); col = [0] * len(nrows)
    for f in frames:
        if not f: continue
        r, x0, y0, x1, y1, band_bottom = f
        crop = im.crop((x0, y0, x1, band_bottom))
        w = max(1, round(crop.width * s)); h = max(1, round(crop.height * s))
        A = np.array(crop.resize((w, h), Image.NEAREST)); al = np.array(crop.resize((w, h), Image.BOX))[..., 3]
        A[..., 3] = np.where(al > 110, 255, 0)
        op = A[..., 3] > 0; H, Wd = op.shape
        for yy in range(H):                                          # contorno marrom-escuro onde a borda ficou clara
            for xx in range(Wd):
                if not op[yy, xx]: continue
                if any(not (0 <= yy + dy < H and 0 <= xx + dx < Wd) or not op[yy + dy, xx + dx] for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    if int(A[yy, xx, :3].sum()) > 200: A[yy, xx, :3] = (36, 20, 12)
        fr = Image.fromarray(A); c = col[r]; col[r] += 1
        ox = c * q + q // 2 - fr.width // 2; oy = r * q + ground - fr.height
        ox = max(c * q, min(ox, c * q + q - fr.width)); oy = max(r * q, oy)
        sheet.alpha_composite(fr, (ox, oy))
    out = ROOT / 'art' / 'sprites' / f'{key}_{kind}.png'; out.parent.mkdir(parents=True, exist_ok=True); sheet.quantize(colors=96, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).save(out, optimize=True)
    register(key, q, kind)
    print('ok', out.relative_to(ROOT), sheet.size, 'escala %.3f' % s)

def register(key, q, kind):
    for f in [ROOT / 'src' / 'game.html', ROOT / 'mmo' / 'client' / 'game.html']:
        t = f.read_text(encoding='utf-8'); m = re.search(r'/\*ART:BEGIN\*/(.*?)/\*ART:END\*/', t, re.S)
        if not m: raise SystemExit('marcador ART não encontrado em ' + str(f))
        d = json.loads(m.group(1)); e = d.get(key, {'q': q}); e['q'] = q; e[kind] = 1; d[key] = e
        t = t[:m.start(1)] + json.dumps(d, separators=(',', ':'), sort_keys=True) + t[m.end(1):]
        f.write_text(t, encoding='utf-8')

if __name__ == '__main__':
    main()
