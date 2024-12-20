import React, { useState, useRef, CSSProperties } from "react";
import { Box, Button } from "@mui/material";
import { ImageList, ImageListItem } from "@mui/material";
import { SideBar } from "../../components/SideBar";
import { convertPGMDataToCanvas } from "../../utils/Conversions";

export const Home = () => {
  const [images, setImages] = useState<HTMLCanvasElement[]>([]);
  const [selectedImages, setSelectedImages] = useState<HTMLCanvasElement[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file: File | null = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (fileExtension === "pgm") {
        const pgmData = await readFileAsText(file);
        const canvas = convertPGMDataToCanvas(pgmData);
        setImages((prevImages) => [...prevImages, canvas]);
      } else {
        const imageDataUrl = await readFileAsDataURL(file);
        const img = new Image();
        img.onload = () => {
          const canvas = createCanvasFromImage(img);
          setImages((prevImages) => [...prevImages, canvas]);
        };
        img.src = imageDataUrl;
      }
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) =>
        typeof e.target?.result === "string"
          ? resolve(e.target.result)
          : reject(new Error("Invalid image data URL"));
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target?.result as string;
        resolve(text);
      };

      reader.onerror = (event) => {
        reject(event.target?.error);
      };

      reader.readAsText(file);
    });
  };

  const createCanvasFromImage = (img: HTMLImageElement): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not supported.");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return canvas;
  };

  const handleSelectImage = (selectedImage: HTMLCanvasElement) => {
    if (selectedImages.length < 2) {
      setSelectedImages((prevSelectedImages) => [
        ...prevSelectedImages,
        selectedImage,
      ]);
    } else {
      setSelectedImages([selectedImage]);
    }
  };

  const handleClearPlaygroundClick = () => {
    setImages([]);
    setSelectedImages([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const renderGallery = (
    <Box
      sx={{
        display: "grid",
        width: "100%",
        gridTemplateColumns: "240px 240px ",
        rowGap: 2,
        columnGap: 2,
      }}
    >
      {images.map((canvas: HTMLCanvasElement, index: number) => (
        <ImageListItem key={index}>
          <Button
            sx={{
              padding: 0,
              border: `5px solid ${
                !selectedImages.includes(canvas)
                  ? "transparent"
                  : selectedImages[0] === canvas && selectedImages[1] === canvas
                  ? "var(--double-selected)"
                  : selectedImages[0] === canvas
                  ? "var(--success)"
                  : selectedImages[1] === canvas
                  ? "var(--error)"
                  : "transparent"
              }`,
              borderRadius: "8px",
              overflow: "hidden",
            }}
            onClick={() => handleSelectImage(canvas)}
          >
            <img
              src={canvas.toDataURL()}
              loading="lazy"
              alt={`Image ${index + 1}`}
              style={{ height: "auto", maxWidth: "240px" }}
            />
          </Button>
        </ImageListItem>
      ))}
    </Box>
  );

  const renderPageContent = <>{renderGallery}</>;

  return (
    <>
      <Box margin="40px 20px">
        <SideBar
          images={images}
          setImages={setImages}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          content={renderPageContent}
          handleImageUpload={handleImageUpload}
          handleClearPlaygroundClick={handleClearPlaygroundClick}
          inputRef={inputRef}
        />
        
      </Box>
    </>
  );
};
