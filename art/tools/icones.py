#!/usr/bin/env python3
"""Recorta uma folha de ícones gerada por IA (grade de 6 colunas, fundo magenta) em um arquivo por item.
  python3 art/tools/icones.py <folha.png> <ids.json>
Gera art/sprites/icon_<id>.png (64x64, fundo transparente) e registra os itens na lista ICON_ART do jogo."""
import sys, json, re, pathlib
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
src, idsf = sys.argv[1], sys.argv[2]
ids = json.load(open(idsf)); n = len(ids); nrows = (n + 5) // 6
a = np.array(Image.open(src).convert('RGBA')).astype(int)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
fg = ~(((r > 150) & (b > 150) & (r - g > 90) & (b - g > 90)) | ((r > 120) & (b > 120) & (g < 70)))
rows = fg.sum(1) > 2; bands = []; s = None
for y, v in enumerate(list(rows) + [False]):
    if v and s is None: s = y
    if not v and s is not None:
        if y - s > 12: bands.append([s, y])
        s = None
hs = sorted(y1 - y0 for y0, y1 in bands); med = hs[len(hs) // 2]
i = 0
while i < len(bands):                                             # faixa muito fina (brilho solto) junta com a vizinha mais perto
    if bands[i][1] - bands[i][0] < med * 0.3 and len(bands) > 1:
        k = i + 1 if i == 0 else i - 1 if i == len(bands) - 1 else (i - 1 if bands[i][0] - bands[i - 1][1] < bands[i + 1][0] - bands[i][1] else i + 1)
        lo, hi = min(i, k), max(i, k); bands[lo] = [bands[lo][0], bands[hi][1]]; del bands[hi]; i = 0; continue
    i += 1
def segs_of(m):
    occ = m.sum(0); segs = []; s = None
    for x, v in enumerate(list(occ > 0) + [False]):
        if v and s is None: s = x
        if not v and s is not None: segs.append([s, x]); s = None
    j = 0
    while j < len(segs) - 1:                                      # pedacinhos colados (brilho, ponta) juntam com o vizinho
        if segs[j + 1][0] - segs[j][1] < 10: segs[j][1] = segs[j + 1][1]; del segs[j + 1]
        else: j += 1
    return [sg for sg in segs if sg[1] - sg[0] > 6]
found = []
for (y0, y1) in bands:
    for (x0, x1) in segs_of(fg[y0:y1]): found.append((y0, y1, x0, x1))
ws = sorted(x1 - x0 for _, _, x0, x1 in found); medw = ws[len(ws) // 2]; F = []
for (y0, y1, x0, x1) in found:                                    # dois ícones grudados: divide ao meio
    k = int(round((x1 - x0) / medw)) if (x1 - x0) > 1.7 * medw else 1
    for i in range(k): F.append((y0, y1, x0 + (x1 - x0) * i // k, x0 + (x1 - x0) * (i + 1) // k))
# mapa opcional (3º argumento): para cada ícone achado, a posição na lista ("0-27,30-35"); sem mapa, exige o mesmo total
if len(sys.argv) > 3:
    pos = []
    for part in sys.argv[3].split(','):
        lo, _, hi = part.partition('-'); pos += list(range(int(lo), int(hi or lo) + 1))
    F = F[:len(pos)]; ids = [ids[p] for p in pos]; n = len(F)
elif len(F) != n: raise SystemExit(f'achei {len(F)} ícones, a lista tem {n} — confira a folha')
out = ROOT / 'art' / 'sprites'; done = []; idx = 0
for (y0, y1, x0, x1) in F:
    if True:
        sub = fg[y0:y1, x0:x1]; ys, xs = np.where(sub)
        cy0, cy1, cx0, cx1 = y0 + ys.min(), y0 + ys.max() + 1, x0 + xs.min(), x0 + xs.max() + 1
        crop = a[cy0:cy1, cx0:cx1].copy(); crop[..., 3] = np.where(fg[cy0:cy1, cx0:cx1], 255, 0)
        im = Image.fromarray(crop.astype(np.uint8)); sc = 58 / max(im.width, im.height)
        w, h = max(1, round(im.width * sc)), max(1, round(im.height * sc))
        A = np.array(im.resize((w, h), Image.LANCZOS)); A[..., 3] = np.where(A[..., 3] > 100, 255, 0)
        cell = Image.new('RGBA', (64, 64), (0, 0, 0, 0)); cell.alpha_composite(Image.fromarray(A), ((64 - w) // 2, (64 - h) // 2))
        cell.save(out / f'icon_{ids[idx]}.png', optimize=True); done.append(ids[idx]); idx += 1
for f in [ROOT / 'src' / 'game.html', ROOT / 'mmo' / 'client' / 'game.html']:
    t = f.read_text(encoding='utf-8'); m = re.search(r'/\*ICONS:BEGIN\*/(.*?)/\*ICONS:END\*/', t, re.S)
    if not m: continue
    have = set(json.loads(m.group(1))) | set(done)
    f.write_text(t[:m.start(1)] + json.dumps(sorted(have), separators=(',', ':')) + t[m.end(1):], encoding='utf-8')
print('ok', len(done), 'ícones de', src)
