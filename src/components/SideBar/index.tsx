// @ts-nocheck
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Toolbar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  AppBar,
  IconButton,
  Typography,
  Drawer,
  Collapse,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import CalculateIcon from "@mui/icons-material/Calculate";
import EmojiSymbolsIcon from "@mui/icons-material/EmojiSymbols";
import { arithmeticOperation } from "../../utils/Operations/Arithmetic";
import {
  ArithmeticOperation,
  ColorChannel,
  LogicOperation,
  PseudocoloringOperation,
  RgbConversion,
  ZoomOperation,
} from "../../types";
import { logicOperation } from "../../utils/Operations/Logic";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Switch from "@mui/material/Switch";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import {
  rgbColorChannelOperation,
  rgbConvertion,
} from "../../utils/Operations/ColorChannels";
import { zoomOperation } from "../../utils/Operations/Zoom";
import { pseudocoloringOperation } from "../../utils/Operations/Pseudocoloring";
import InvertColorsIcon from '@mui/icons-material/InvertColors';

const drawerWidth = 240;

interface SideBarProps {
  window?: () => Window;
  content: any;
  images: HTMLCanvasElement[];
  setImages: React.Dispatch<React.SetStateAction<HTMLCanvasElement[]>>;
  selectedImages: HTMLCanvasElement[];
  setSelectedImages: React.Dispatch<React.SetStateAction<HTMLCanvasElement[]>>;
  handleImageUpload: any;
  handleClearPlaygroundClick: any;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const SideBar = (props: SideBarProps) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [arithmeticOpen, setArithmeticOpen] = useState(false);
  const [logicOpen, setLogicOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [colorChannelsOpen, setColorChannelsOpen] = useState(false);
  const [pseudocoloring, setPseudocoloring] = useState(false);

  const executeArithmeticOperation = (operationType: ArithmeticOperation) => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement = arithmeticOperation(
        props.selectedImages[0],
        props.selectedImages[1],
        operationType
      );
      props.setImages((previousImages) => [...previousImages, operationResult]);
    }
  };

  const executeLogicOperation = (operationType: LogicOperation) => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement = logicOperation(
        props.selectedImages[0],
        props.selectedImages[1],
        operationType
      );
      props.setImages((previousImages) => [...previousImages, operationResult]);
    }
  };

  const executeColorChannelOperation = (operationType: ColorChannel) => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement = rgbColorChannelOperation(
        props.selectedImages[0],
        operationType
      );
      props.setImages((previousImages) => [...previousImages, operationResult]);
    }
  };

  const executeRgbConversionOperation = (operationType: RgbConversion) => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement[] = rgbConvertion(
        props.selectedImages[0],
        operationType
      );
      operationResult.forEach((image) => {
        props.setImages((previousImages) => [...previousImages, image]);
      });
    }
  };

  const executeZoomOperation = (operationType: ZoomOperation) => {
    if (props.images.length > 0) {
      const zoomFactor = Number(prompt("Defina o fator de zoom: "));

      const operationResult: HTMLCanvasElement = zoomOperation(
        props.selectedImages[0],
        operationType,
        zoomFactor
      );
      props.setImages((previousImages) => [...previousImages, operationResult]);
    }
  };

  const executePseudocoloringOperation = (
    operationType: PseudocoloringOperation
  ) => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement = pseudocoloringOperation(
        props.selectedImages[0],
        operationType
      );
      props.setImages((previousImages) => [...previousImages, operationResult]);
    }
  };

  const drawer = (
    <Box height="100vh">
      <Toolbar
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Typography variant="h5" fontWeight="bold">
          Operations
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItemButton onClick={() => setArithmeticOpen(!arithmeticOpen)}>
          <ListItemIcon>
            <CalculateIcon />
          </ListItemIcon>
          <ListItemText primary="Arithmetics" />
          {arithmeticOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={arithmeticOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() =>
                executeArithmeticOperation(ArithmeticOperation.ADDITION)
              }
            >
              <ListItemText primary="Addition (+)" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() =>
                executeArithmeticOperation(ArithmeticOperation.SUBTRACTION)
              }
            >
              <ListItemText primary="Subtraction (-)" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() =>
                executeArithmeticOperation(ArithmeticOperation.MULTIPLICATION)
              }
            >
              <ListItemText primary="Multiplication (x)" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() =>
                executeArithmeticOperation(ArithmeticOperation.DIVISION)
              }
            >
              <ListItemText primary="Division (/)" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={() => setLogicOpen(!logicOpen)}>
          <ListItemIcon>
            <EmojiSymbolsIcon />
          </ListItemIcon>
          <ListItemText primary="Logic" />
          {logicOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={logicOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => executeLogicOperation(LogicOperation.AND)}
            >
              <ListItemText primary="AND (&)" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => executeLogicOperation(LogicOperation.OR)}
            >
              <ListItemText primary="OR (|)" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => executeLogicOperation(LogicOperation.XOR)}
            >
              <ListItemText primary="XOR (^)" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={() => setZoomOpen(!zoomOpen)}>
          <ListItemIcon>
            <ZoomInMapIcon />
          </ListItemIcon>
          <ListItemText primary="Zoom" />
          {zoomOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={zoomOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => executeZoomOperation(ZoomOperation.REPLICATION)}
            >
              <ListItemText primary="Zoom IN (Replication)" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => executeZoomOperation(ZoomOperation.INTERPOLATION)}
            >
              <ListItemText primary="Zoom IN (Interpolation)" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => executeZoomOperation(ZoomOperation.DELETION)}
            >
              <ListItemText primary="Zoom OUT (Deletion)" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => executeZoomOperation(ZoomOperation.MEAN_VALUE)}
            >
              <ListItemText primary="Zoom OUT (Mean Value)" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItemButton
          onClick={() => setColorChannelsOpen(!colorChannelsOpen)}
        >
          <ListItemIcon>
            <ColorLensIcon />
          </ListItemIcon>
          <ListItemText primary="Color Channels" />
          {colorChannelsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={colorChannelsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => executeColorChannelOperation(ColorChannel.RED)}
            >
              <ListItemText primary="Red Channel (R)" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => executeColorChannelOperation(ColorChannel.GREEN)}
            >
              <ListItemText primary="Green Channel (G)" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => executeColorChannelOperation(ColorChannel.BLUE)}
            >
              <ListItemText primary="Blue Channel (B)" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => executeRgbConversionOperation(RgbConversion.HSB)}
            >
              <ListItemText primary="Convert to HSB" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => executeRgbConversionOperation(RgbConversion.YUV)}
            >
              <ListItemText primary="Convert to YUV" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() => executeRgbConversionOperation(RgbConversion.CMYK)}
            >
              <ListItemText primary="Convert to CMYK" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={() => setPseudocoloring(!pseudocoloring)}>
          <ListItemIcon>
            <InvertColorsIcon />
          </ListItemIcon>
          <ListItemText primary="Pseudocoloring" />
          {pseudocoloring ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={pseudocoloring} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() =>
                executePseudocoloringOperation(
                  PseudocoloringOperation.DENSITY_SLICING
                )
              }
            >
              <ListItemText primary="Density slicing" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={() =>
                executePseudocoloringOperation(
                  PseudocoloringOperation.REDISTRIBUTION
                )
              }
            >
              <ListItemText primary="Color redistribution" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "#242424",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" noWrap component="div" fontWeight="bold">
            Workspace
          </Typography>
          <Box display="flex" alignItems="center">
            <Box display="flex" margin="0px 40px" gap={1} alignItems="center">
              <Typography>normalize</Typography>
              <Switch />
              <Typography>truncation</Typography>
            </Box>
            <Box>
              <Tooltip title="Add image to workspace">
                <IconButton sx={{ color: "#ffffff" }}>
                  <input
                    type="file"
                    accept=".jpeg, .jpg, .bmp, .png, .gif, .tiff, .pgm"
                    id="image-upload"
                    multiple
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                      cursor: "pointer",
                    }}
                    onChange={props.handleImageUpload}
                    ref={props.inputRef}
                  />
                  <AddPhotoAlternateIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear workspace">
                <IconButton
                  sx={{ color: "#ffffff" }}
                  onClick={props.handleClearPlaygroundClick}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {props.content}
      </Box>
    </Box>
  );
};
