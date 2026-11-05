"""Generate the portable local prototype without dependencies or deployment."""
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = root / 'dist'
html = (source / 'index.html').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="style.css">',
                    '<style>' + (source / 'style.css').read_text(encoding='utf-8') + '</style>')
scripts = ['translations.js', 'app.js', 'directory.js', 'language.js']
for name in scripts:
    html = html.replace(f'<script src="{name}" defer></script>', '')
embedded = ''.join('<script>\n' + (source / name).read_text(encoding='utf-8').replace('</script', '<\\/script')
                   + '\n</script>' for name in scripts)
html = html.replace('</body>', embedded + '</body>')
(root / 'Farmers-Dream.html').write_text(html, encoding='utf-8')
print('Generated Farmers-Dream.html')
