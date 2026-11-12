#!/usr/bin/env python3
"""Gera a pasta dist/ pronta para publicar.

dist/index.html        página completa do jogo
dist/config.js         configuração (contas ligadas ou não)
dist/brumaval-itch.zip pacote para enviar ao itch.io
"""
import pathlib, shutil, zipfile

root = pathlib.Path(__file__).resolve().parent
game = (root / 'src' / 'game.html').read_text(encoding='utf-8')
head = '''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Brumaval: RPG 2D de quadrados no navegador, com classes, masmorras e chefes.">
<meta name="theme-color" content="#13100d">
<script src="config.js"></script>
'''
dist = root / 'dist'
shutil.rmtree(dist, ignore_errors=True)
dist.mkdir()
(dist / 'index.html').write_text(head + game + '\n</html>\n', encoding='utf-8')
shutil.copy(root / 'config.js', dist / 'config.js')
with zipfile.ZipFile(dist / 'brumaval-itch.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    z.write(dist / 'index.html', 'index.html')
    z.write(dist / 'config.js', 'config.js')
print('dist/ pronto:', ', '.join(sorted(p.name for p in dist.iterdir())))
