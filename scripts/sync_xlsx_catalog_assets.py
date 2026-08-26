import json
import mimetypes
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests

project = Path('/home/ubuntu/jacque-pegue-monte-layout')
assets_dir = Path('/home/ubuntu/webdev-static-assets/jacque-catalog')
updated_path = project / 'data/catalogo-xlsx-atualizado.json'
previous_path = project / 'data/catalogo-importado.json'
output_path = project / 'data/catalogo-sincronizado.json'

updated = json.loads(updated_path.read_text())
previous = json.loads(previous_path.read_text())
previous_by_slug = {item['slug']: item for item in previous}

def extension_from(url, content_type):
    if content_type:
        guessed = mimetypes.guess_extension(content_type.split(';')[0].strip())
        if guessed:
            return '.jpg' if guessed == '.jpe' else guessed
    match = re.search(r'\.(png|jpe?g|webp|gif)(?:$|[?#])', url, re.I)
    return f".{match.group(1).lower().replace('jpeg', 'jpg')}" if match else '.jpg'

def download(item):
    try:
        response = requests.get(
            item['imageSource'],
            headers={'User-Agent': 'Mozilla/5.0 (compatible; JacquePegueMonteCatalog/1.0)'},
            timeout=(10, 35),
        )
        response.raise_for_status()
        extension = extension_from(item['imageSource'], response.headers.get('content-type', ''))
        filename = f"{item['slug']}{extension}"
        local_path = assets_dir / filename
        local_path.write_bytes(response.content)
        return item['slug'], {**item, 'filename': filename, 'localPath': str(local_path), 'bytes': len(response.content), 'status': 'downloaded'}
    except Exception as error:
        return item['slug'], {**item, 'status': 'failed', 'error': str(error)}

assets_dir.mkdir(parents=True, exist_ok=True)
merged = []
needs_download = []
for item in updated:
    previous_item = previous_by_slug.get(item['slug'])
    if previous_item and previous_item.get('status') == 'downloaded' and Path(previous_item['localPath']).exists() and previous_item.get('imageSource') == item['imageSource']:
        merged.append({**previous_item, **item, 'status': 'downloaded'})
    else:
        needs_download.append(item)

downloaded = {}
with ThreadPoolExecutor(max_workers=4) as executor:
    futures = [executor.submit(download, item) for item in needs_download]
    for future in as_completed(futures):
        slug, item = future.result()
        downloaded[slug] = item

merged.extend(downloaded[item['slug']] for item in needs_download)
merged.sort(key=lambda item: [record['slug'] for record in updated].index(item['slug']))
output_path.write_text(json.dumps(merged, ensure_ascii=False, indent=2) + '\n')

print(json.dumps({
    'total': len(merged),
    'reused': len(merged) - len(needs_download),
    'new_assets': len(needs_download),
    'downloaded': sum(item.get('status') == 'downloaded' for item in downloaded.values()),
    'failed': [item['name'] for item in downloaded.values() if item.get('status') != 'downloaded'],
}, ensure_ascii=False, indent=2))
