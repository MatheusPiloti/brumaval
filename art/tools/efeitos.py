#!/usr/bin/env python3
"""Converte folhas de efeitos de magia geradas por IA (fundo preto) em folhas do jogo.
  python3 art/tools/efeitos.py <folha.png> <saida.png> <colunas> <largura_do_quadro> <altura_do_quadro> <ancora: chao|centro>
O preto vira transparência suave (o brilho continua brilhando por cima do cenário)."""
import sys, numpy as np
from PIL import Image
src, out, ncol, CW, CH, anchor = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5]), sys.argv[6]
a = np.array(Image.open(src).convert('RGB')).astype(float); H, W = a.shape[:2]
mx = a.max(2); fg = mx > 28
rows = fg.sum(1) > 2; bands = []; s = None
for y, v in enumerate(list(rows) + [False]):
    if v and s is None: s = y
    if not v and s is not None:
        if y - s > 20: bands.append((s, y))
        s = None
def cuts(b, n):
    occ = b.sum(0); xs = np.where(occ > 0)[0]; x0, x1 = xs[0], xs[-1] + 1; w = (x1 - x0) / n; res = [x0]
    for i in range(1, n):
        ideal = x0 + i * w; lo, hi = int(ideal - w * 0.35), int(ideal + w * 0.35); res.append(lo + int(np.argmin(occ[lo:hi])))
    res.append(x1); return [(res[i], res[i + 1]) for i in range(n)]
want = int(sys.argv[7]) if len(sys.argv) > 7 else len(bands)
while len(bands) > want:                                               # junta a faixa mais baixa (gotas soltas, faíscas) com a vizinha mais próxima
    i = min(range(len(bands)), key=lambda j: bands[j][1] - bands[j][0])
    if i == 0: k = 1
    elif i == len(bands) - 1: k = i - 1
    else: k = i - 1 if bands[i][0] - bands[i - 1][1] < bands[i + 1][0] - bands[i][1] else i + 1
    lo, hi = min(i, k), max(i, k); bands[lo] = (bands[lo][0], bands[hi][1]); del bands[hi]
sheet = Image.new('RGBA', (CW * ncol, CH * len(bands)), (0, 0, 0, 0))
for r, (y0, y1) in enumerate(bands):
    fr = []
    for (x0, x1) in cuts(fg[y0:y1], ncol):
        sub = fg[y0:y1, x0:x1]; ys, xs = np.where(sub)
        fr.append((x0 + xs.min(), y0 + ys.min(), x0 + xs.max() + 1, y0 + ys.max() + 1) if len(xs) else None)
    mw = max(f[2] - f[0] for f in fr if f); mh = max(f[3] - f[1] for f in fr if f)
    sc = min((CW - 4) / mw, (CH - 4) / mh)
    bot = max(f[3] for f in fr if f)                                   # base comum da linha (efeitos que saem do chão)
    for c, f in enumerate(fr):
        if not f: continue
        x0, fy0, x1, fy1 = f; cy0 = fy0; cy1 = bot if anchor == 'chao' else fy1
        crop = a[cy0:cy1, x0:x1]; m = crop.max(2)
        al = np.clip((m - 18) / 140.0, 0, 1)                           # preto -> transparente, brilho -> opaco
        rgb = np.where(al[..., None] > 0, crop / np.maximum(al[..., None], 0.35), 0); rgb = np.clip(rgb, 0, 255)
        im = Image.fromarray(np.dstack([rgb, al * 255]).astype(np.uint8), 'RGBA')
        w = max(1, round(im.width * sc)); h = max(1, round(im.height * sc)); im = im.resize((w, h), Image.BOX)
        ox = c * CW + (CW - w) // 2
        oy = r * CH + (CH - 2 - h if anchor == 'chao' else (CH - h) // 2)
        sheet.alpha_composite(im, (ox, max(r * CH, oy)))
sheet.save(out, optimize=True); print('ok', out, sheet.size, 'linhas', len(bands))
