import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const assetsDir = path.join(process.cwd(), 'src', 'assets');
const originalsDir = path.join(assetsDir, 'originals');

async function compressImages() {
  try {
    const files = fs.readdirSync(originalsDir);
    
    for (const file of files) {
      if (!file.endsWith('.webp')) continue;
      
      const inputPath = path.join(originalsDir, file);
      const outputPath = path.join(assetsDir, file);
      
      console.log(`Comprimindo: ${file}...`);
      
      let sharpInstance = sharp(inputPath);
      const metadata = await sharpInstance.metadata();
      
      // If width is larger than 1920px, resize it (standard full HD web max)
      if (metadata.width && metadata.width > 1920) {
        sharpInstance = sharpInstance.resize({ width: 1920, withoutEnlargement: true });
      }
      
      // Heavily compress WebP to 75% quality
      await sharpInstance
        .webp({ quality: 75, effort: 6 })
        .toFile(outputPath);
        
      const originalSize = fs.statSync(inputPath).size / 1024;
      const newSize = fs.statSync(outputPath).size / 1024;
      
      console.log(`✅ ${file}: ${originalSize.toFixed(2)} KB -> ${newSize.toFixed(2)} KB`);
    }
    
    console.log('Compressão concluída!');
  } catch (err) {
    console.error('Erro na compressão:', err);
  }
}

compressImages();
