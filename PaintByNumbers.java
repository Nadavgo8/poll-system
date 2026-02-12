import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Path;
import javax.imageio.ImageIO;

public class PaintByNumbers {

  public boolean paintByNumbers(Path origin, Path target, int colors) {
    if (colors < 2 || origin == null || target == null) return false; // Input validation

    final BufferedImage img; 
    try { // Check if the origin image cannot be found or cannot be read
      img = ImageIO.read(origin.toFile());
      if (img == null) return false;
    } catch (IOException e) {
      return false;
    }

    int w = img.getWidth(), h = img.getHeight();
    int[] px = img.getRGB(0, 0, w, h, null, 0, w); //Get pixel data (all pixels at once)

    int levels = Math.max(2, (int) Math.round(Math.cbrt(colors))); // Get cube root of colors so i can know how many "levels"" there will be for each R/G/B.

    int step = Math.max(1, 256 / levels); //Calculating step size.

    for (int i = 0; i < px.length; i++) {// For each pixel
      int a = (px[i] >>> 24) & 0xFF; //Extract components
      int r = (px[i] >>> 16) & 0xFF;
      int g = (px[i] >>> 8) & 0xFF;
      int b = px[i] & 0xFF;

      r = (r / step) * step + step / 2; // Divide into bins and map into center of bin.
      g = (g / step) * step + step / 2;
      b = (b / step) * step + step / 2;

      if (r > 255) r = 255; // Make sure doesnt exceed 255
      if (g > 255) g = 255;
      if (b > 255) b = 255;

      px[i] = (a << 24) | (r << 16) | (g << 8) | b; // Build new pixel
    }

    BufferedImage out = new BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB);
    out.setRGB(0, 0, w, h, px, 0, w);

    try {
      return ImageIO.write(out, "png", target.toFile());
    } catch (IOException e) {
      return false;
    }
  }
}
