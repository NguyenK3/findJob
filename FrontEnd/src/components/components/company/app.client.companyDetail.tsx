"use client"
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Card,
  Grid,
  Avatar,
  Container,
  CircularProgress,
} from "@mui/material";
import DOMPurify from "dompurify";
import Modal from "react-modal";
import { styled } from '@mui/system';

interface CompanyDetailProps {
  id: string;
}

const StyledAvatar = styled(Avatar)({
  transition: 'transform 0.3s ease',
  borderRadius: '0', // Logo hình vuông
  width: 100,
  height: 100,
  objectFit: 'contain',
  padding: '10px',
  backgroundColor: '#fff',
  '& img': {
    objectFit: 'contain',
    width: '100%',
    height: '100%',
  },
  '&:hover': {
    transform: 'scale(1.1)', // Hiệu ứng hover logo
  },
});

const CompanyDetail: React.FC<CompanyDetailProps> = ({ id }) => {
  const [company, setCompany] = useState<ICompany | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");

  useEffect(() => {
    if (id) {
      const fetchCompany = async () => {
        const response = await fetch(
          `http://localhost:8000/api/v1/companies/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setCompany(data.data);
      };
      fetchCompany();
    }
  }, [id]);

  const openModal = (imgSrc: string) => {
    setModalImageSrc(imgSrc);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalImageSrc("");
  };

  const parseDescription = (html: string) => {
    const sanitizedHTML = DOMPurify.sanitize(html);
    const div = document.createElement("div");
    div.innerHTML = sanitizedHTML;

    const elements = Array.from(div.children);
    const groupedElements: Array<JSX.Element> = [];
    const imageElements: Array<JSX.Element> = [];
    let currentGroup: JSX.Element[] = [];
    let imageCount = 0;

    elements.forEach((element, index) => {
      const tagName = element.tagName.toLowerCase();

      if (tagName.startsWith("h")) {
        if (currentGroup.length > 0) {
          groupedElements.push(
            <Box
              key={`group-${groupedElements.length}`}
              sx={{
                marginBottom: 3,
                padding: 2,
                backgroundColor: "#ffffff",
                borderRadius: 2,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                border: "1px solid #e0e0e0",
              }}
            >
              {currentGroup}
            </Box>
          );
          currentGroup = [];
        }

        currentGroup.push(
          <Typography
            key={`title-${index}`}
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#333",
              marginBottom: 1,
            }}
            dangerouslySetInnerHTML={{ __html: element.outerHTML }}
          />
        );
      } else if (tagName === "p") {
        const imgElements = Array.from(element.querySelectorAll("img"));
        if (imgElements.length > 0) {
          imgElements.forEach((imgElement, imgIndex) => {
            const imgSrc = imgElement.getAttribute("src") || "";
            const imgAlt = imgElement.getAttribute("alt") || "Image";

            // Remove the img element from the paragraph
            imgElement.remove();

            // Add the img element separately
            imageCount++;
            imageElements.push(
              <Box
                key={`image-${index}-${imgIndex}`}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 2,
                  padding: 2,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 2,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  border: "1px solid #e0e0e0",
                  width: "calc(25% - 10px)", // For 4 images per row
                  marginRight: "10px",
                }}
                onClick={() => openModal(imgSrc)}
              >
                <img
                  src={imgSrc}
                  alt={imgAlt}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                />
              </Box>
            );
          });
        } else {
          currentGroup.push(
            <Typography
              key={`paragraph-${index}`}
              variant="body1"
              sx={{
                color: "#555",
                lineHeight: 1.8,
                marginBottom: 1,
              }}
              dangerouslySetInnerHTML={{ __html: element.outerHTML }}
            />
          );
        }
      } else {
        currentGroup.push(
          <Typography
            key={`paragraph-${index}`}
            variant="body1"
            sx={{
              color: "#555",
              lineHeight: 1.8,
              marginBottom: 1,
            }}
            dangerouslySetInnerHTML={{ __html: element.outerHTML }}
          />
        );
      }
    });

    if (currentGroup.length > 0) {
      groupedElements.push(
        <Box
          key={`group-${groupedElements.length}`}
          sx={{
            marginBottom: 3,
            padding: 2,
            backgroundColor: "#ffffff",
            borderRadius: 2,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0",
          }}
        >
          {currentGroup}
        </Box>
      );
    }

    // Show number of remaining images if more than 4 images
    if (imageCount > 4) {
      imageElements.push(
        <Box
          key="more-images"
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              cursor: "pointer",
              color: "#007bff",
              textDecoration: "underline",
            }}
            onClick={() => alert("Show all images")}
          >
            +{imageCount - 4} more images
          </Typography>
        </Box>
      );
    }

    return [
      <Box
        key="image-container"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          marginBottom: 3,
          width: "100%", // Full width
        }}
      >
        {imageElements}
      </Box>,
      ...groupedElements,
    ];
  };

  if (!company) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f9f9fb", minHeight: "100vh", paddingBottom: 4 }}>
      {/* Content */}
      <Container maxWidth="xl" sx={{ marginTop: 4 }}>
        {/* General Info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // minHeight: "100vh", // Ensure full viewport height for vertical centering
          }}
        >
          <Card
            sx={{
              marginBottom: 4,
              padding: 3,
              borderRadius: 2,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#ffffff",
              display: "flex",
              justifyContent: "center", // Center content horizontally
              alignItems: "center", // Center content vertically
              width: "90%", // Adjust width for responsiveness
              maxWidth: 600, // Ensure card does not exceed a certain width
            }}
          >
            <Grid container spacing={3} alignItems="center" justifyContent="center">
              <Grid item xs={12} sm={4} display="flex" justifyContent="center" alignItems="center">
                <StyledAvatar
                  src={company.logo}
                  alt={company.name}
                  sx={{ width: 80, height: 80, objectFit: "contain" }} // Adjust avatar size and fit
                />
              </Grid>
              <Grid item xs={12} sm={8} textAlign="center">
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: 1, // Increase space below the company name
                  }}
                >
                  {company.name}
                </Typography>
                <Typography sx={{ color: "#555", marginBottom: 1 }}>
                  <strong>Địa chỉ:</strong> {company.address}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Box>


        {/* Company Description */}
        <Card
          sx={{
            padding: 3,
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            backgroundColor: "#ffffff",
            width: "100%", // Full width
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#333", marginBottom: 2 }}
          >
            Mô tả công ty
          </Typography>
          <Box>{parseDescription(company.description)}</Box>
        </Card>
      </Container>

      {/* Modal for image zoom */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Zoom"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <img src={modalImageSrc} alt="Zoomed" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        <button onClick={closeModal}>Close</button>
      </Modal>
    </Box>
  );
};

export default CompanyDetail;