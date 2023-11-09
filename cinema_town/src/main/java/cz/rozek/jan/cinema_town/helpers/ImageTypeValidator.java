package cz.rozek.jan.cinema_town.helpers;

import java.io.IOException;

import org.apache.commons.imaging.ImageInfo;
import org.apache.commons.imaging.ImageReadException;
import org.apache.commons.imaging.Imaging;

public class ImageTypeValidator  {
    public static String getImageType(byte[] imageData) throws ImageReadException, IOException {
        ImageInfo imageInfo = Imaging.getImageInfo(imageData);
        return imageInfo.getMimeType();
    }

}
