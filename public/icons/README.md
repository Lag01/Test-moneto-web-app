# Instructions pour les icônes PWA

Pour que l'application fonctionne correctement en tant que PWA, vous devez ajouter les icônes suivantes dans ce dossier :

## Icônes requises

- `icon-72x72.png` (72x72 pixels)
- `icon-96x96.png` (96x96 pixels)
- `icon-128x128.png` (128x128 pixels)
- `icon-144x144.png` (144x144 pixels)
- `icon-152x152.png` (152x152 pixels)
- `icon-192x192.png` (192x192 pixels)
- `icon-384x384.png` (384x384 pixels)
- `icon-512x512.png` (512x512 pixels)

## Comment générer les icônes

### Option 1 : Utiliser un générateur en ligne

1. Créez une icône source en 512x512 pixels avec votre logo
2. Utilisez un service comme https://realfavicongenerator.net/ ou https://www.pwabuilder.com/
3. Générez toutes les tailles nécessaires
4. Placez-les dans ce dossier

### Option 2 : Utiliser ImageMagick

```bash
# À partir d'une image source icon.png de 512x512
convert icon.png -resize 72x72 icon-72x72.png
convert icon.png -resize 96x96 icon-96x96.png
convert icon.png -resize 128x128 icon-128x128.png
convert icon.png -resize 144x144 icon-144x144.png
convert icon.png -resize 152x152 icon-152x152.png
convert icon.png -resize 192x192 icon-192x192.png
convert icon.png -resize 384x384 icon-384x384.png
convert icon.png -resize 512x512 icon-512x512.png
```

### Option 3 : Icônes de placeholder temporaires

Pour le développement, vous pouvez créer des icônes de placeholder simples avec un fond de couleur et le texte "M" (pour Moneto).

## Design recommandé

- Utilisez le vert émeraude (#10b981) comme couleur principale
- Logo simple et reconnaissable
- Fond uni ou avec dégradé subtil
- Texte lisible même en petite taille
- Format PNG avec transparence ou fond blanc
