"""Generate the portable local prototype without dependencies or deployment."""
from pathlib import Path
import base64
import mimetypes

root = Path(__file__).resolve().parents[1]
source = root / 'dist'
html = (source / 'index.html').read_text(encoding='utf-8')
css = (source / 'style.css').read_text(encoding='utf-8')
assets = source / 'assets'
if assets.exists():
    for asset in assets.rglob('*'):
        if asset.is_file():
            relative = asset.relative_to(source).as_posix()
            mime = mimetypes.guess_type(asset.name)[0] or 'application/octet-stream'
            data = 'data:' + mime + ';base64,' + base64.b64encode(asset.read_bytes()).decode('ascii')
            css = css.replace("url('" + relative + "')", "url('" + data + "')")
            html = html.replace('src="' + relative + '"', 'src="' + data + '"')
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + css + '</style>')

scripts = ['translations.js', 'app.js', 'community.js', 'directory.js', 'language.js']
for name in scripts:
    html = html.replace(f'<script src="{name}" defer></script>', '')
embedded = ''.join('<script>\n' + (source / name).read_text(encoding='utf-8').replace('</script', '<\\/script')
                   + '\n</script>' for name in scripts)
html = html.replace('</body>', embedded + '</body>')
(root / 'Farmers-Dream.html').write_text(html, encoding='utf-8')
print('Generated Farmers-Dream.html')
