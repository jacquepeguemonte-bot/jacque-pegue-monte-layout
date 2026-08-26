import json
from pathlib import Path

project = Path('/home/ubuntu/jacque-pegue-monte-layout')
previous = json.loads((project / 'data/catalogo-importado.json').read_text())
synced = json.loads((project / 'data/catalogo-sincronizado.json').read_text())
previous_slugs = {item['slug'] for item in previous}
new_paths = [item['localPath'] for item in synced if item['slug'] not in previous_slugs]
output = project / 'data/xlsx-new-asset-paths.txt'
output.write_text('\n'.join(new_paths) + '\n')
print(f'{len(new_paths)} novos ativos listados em {output}')
