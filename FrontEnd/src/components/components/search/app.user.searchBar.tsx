"use client";

import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useState } from "react";

const SearchBar = () => {
  const [city, setCity] = useState("all");
  const [keyword, setKeyword] = useState("");

  const handleCityChange = (event: SelectChangeEvent<string>) => {
    setCity(event.target.value);
  };

  interface KeywordChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleKeywordChange = (event: KeywordChangeEvent) => {
    setKeyword(event.target.value);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      p={1.5}
      borderRadius={3}
      maxWidth="80%"
      mx="auto"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
      sx={{
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      {/* Dropdown chọn thành phố */}
      <Select
        value={city}
        onChange={handleCityChange}
        displayEmpty
        startAdornment={
          <InputAdornment position="start">
            <LocationOnIcon fontSize="small" color="action" />
          </InputAdornment>
        }
        sx={{
          bgcolor: "white",
          borderRadius: "6px",
          minWidth: "160px",
          marginRight: "12px",
          "& .MuiSelect-select": { paddingLeft: "8px", color: "#333" },
          "&:hover": {
            bgcolor: "#f5f5f5",
          },
          "&.Mui-focused": {
            bgcolor: "#f5f5f5",
          },
        }}
      >
        <MenuItem value="all">Tất cả thành phố</MenuItem>
        <MenuItem value="hanoi">Hà Nội</MenuItem>
        <MenuItem value="hcmc">TP. Hồ Chí Minh</MenuItem>
        {/* Thêm các thành phố khác nếu cần */}
      </Select>

      {/* Ô tìm kiếm từ khóa */}
      <TextField
        variant="outlined"
        placeholder="Tìm kiếm công việc, kỹ năng, công ty..."
        value={keyword}
        onChange={handleKeywordChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {keyword && (
                <Button
                  onClick={() => setKeyword("")}
                  sx={{
                    minWidth: "24px",
                    padding: "4px",
                    color: "#888",
                    "&:hover": {
                      color: "#555",
                    },
                  }}
                >
                  ✕
                </Button>
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          flex: 1,
          bgcolor: "white",
          borderRadius: "6px",
          marginRight: "12px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#ddd",
            },
            "&:hover fieldset": {
              borderColor: "#aaa",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#d32f2f",
            },
          },
          "& .MuiOutlinedInput-input": { padding: "10px 14px" },
        }}
      />

      {/* Nút tìm kiếm */}
      <Button
        variant="contained"
        color="error"
        startIcon={<SearchIcon />}
        sx={{
          bgcolor: "#d32f2f",
          color: "white",
          borderRadius: "6px",
          padding: "10px 20px",
          fontWeight: "bold",
          fontSize: "0.9rem",
          textTransform: "none",
          transition: "background-color 0.3s ease",
          "&:hover": {
            bgcolor: "#b71c1c",
          },
        }}
      >
        Tìm Kiếm
      </Button>
    </Box>
  );
};

export default SearchBar;
