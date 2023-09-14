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
  FormControl,
  MenuItem,
  Select,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import CalculateIcon from "@mui/icons-material/Calculate";
import EmojiSymbolsIcon from "@mui/icons-material/EmojiSymbols";
import { arithmeticOperation } from "../../utils/FirstUnityOperations/Arithmetic";
import {
  ArithmeticOperation,
  ColorChannel,
  EnhancementOperation,
  Interval,
  LogicOperation,
  PseudocoloringOperation,
  RgbConversion,
  TransformationOperation,
  ZoomOperation,
} from "../../types";
import { logicOperation } from "../../utils/FirstUnityOperations/Logic";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import TransformIcon from "@mui/icons-material/Transform";
import {
  rgbColorChannelOperation,
  rgbConvertion,
} from "../../utils/FirstUnityOperations/ColorChannels";
import { zoomOperation } from "../../utils/FirstUnityOperations/Zoom";
import { pseudocoloringOperation } from "../../utils/FirstUnityOperations/Pseudocoloring";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { transformationOperation } from "../../utils/FirstUnityOperations/Transformations";
import { enhancementOperation } from "../../utils/FirstUnityOperations/Enhancement";
import {
  equalizationOperation,
  executeGammaCorrection,
} from "../../utils/SecondUnityOperations/Gama&Equalization";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import LayersIcon from "@mui/icons-material/Layers";
import { executeBitSlicing } from "../../utils/SecondUnityOperations/BitSlicing";
import PhotoFilterIcon from "@mui/icons-material/PhotoFilter";
import {
  BorderDetectionFilter,
  HalftoningFilter,
  HighPassFilter,
  LineDetectionFilter,
  LowPassFilter,
  ThresholdingType,
} from "../../types/filters";
import { executeLowPassFilter } from "../../utils/SecondUnityOperations/LowPassFilters";
import { executeHighPassFilter } from "../../utils/SecondUnityOperations/HighPassFilters";
import { executeHalftoning } from "../../utils/SecondUnityOperations/HalftoningFilters";
import BorderStyleIcon from "@mui/icons-material/BorderStyle";
import { executeBorderDetection } from "../../utils/SecondUnityOperations/BorderDetection";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import { executeDotDetection } from "../../utils/SecondUnityOperations/DotDetection";
import GridGoldenratioIcon from "@mui/icons-material/GridGoldenratio";
import { executeLineDetection } from "../../utils/SecondUnityOperations/LineDetection";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import { executeThresholding } from "../../utils/SecondUnityOperations/Thresholding";
import { executeRegionSegmentation } from "../../utils/SecondUnityOperations/RegionSegmentation";

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
  const [transformationOpen, setTransformationOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [colorChannelsOpen, setColorChannelsOpen] = useState(false);
  const [pseudocoloringOpen, setPseudocoloringOpen] = useState(false);
  const [enhancementsOpen, setEnhancementsOpen] = useState(false);
  const [gamaAndEqOpen, setGamaAndEqOpen] = useState(false);
  const [bitSlicingOpen, setBitSlicingOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dotDetectionOpen, setDotDetectionOpen] = useState(false);
  const [lineDetectionOpen, setLineDetectionOpen] = useState(false);
  const [borderDetectionOpen, setBorderDetectionOpen] = useState(false);
  const [thresholdingOpen, setThresholdingOpen] = useState(false);
  const [regionSegmentationOpen, setRegionSegmentationOpen] = useState(false);

  const [zoomSelected, setZoomSelected] = useState<ZoomOperation>(
    ZoomOperation.REPLICATION
  );
  const [transformationSelected, setTranformationSelected] =
    useState<TransformationOperation>(TransformationOperation.ROTATION);
  const [enhancementSelected, setEnhancementSelected] =
    useState<EnhancementOperation>(EnhancementOperation.INTERVAL);

  const [filterTypeSelected, setFilterTypeSelected] = useState<string>("LOW");

  const [lineDetectionSelected, setLineDetectionSelected] =
    useState<LineDetectionFilter>(LineDetectionFilter.HORIZONTAL);
  const [borderDetectionSelected, setBorderDetectionSelected] =
    useState<BorderDetectionFilter>(BorderDetectionFilter.ROBERTS);
  const [thresholdingSelected, setThresholdingSelected] =
    useState<ThresholdingType>(ThresholdingType.GLOBAL);

  const [lowPassFilterSelected, setLowPassFilterSelected] =
    useState<LowPassFilter>(LowPassFilter.MEAN_3X3);
  const [highPassFilterSelected, setHighPassFilterSelected] =
    useState<HighPassFilter>(HighPassFilter.H1);
  const [halftoningFilterSelected, setHalftoningFilterSelected] =
    useState<HalftoningFilter>(HalftoningFilter.ORDERED_DOT_PLOT_2X2);

  const [zoomFactor, setZoomFactor] = useState<number>(1);

  const [rotationFactor, setRotationFactor] = useState<number>(0);
  const [xTranslationFactor, setXTranslationFactor] = useState<number>(0);
  const [yTranslationFactor, setYTranslationFactor] = useState<number>(0);
  const [xScaleFactor, setXScaleFactor] = useState<number>(1);
  const [yScaleFactor, setYScaleFactor] = useState<number>(1);
  const [xShearFactor, setXShearFactor] = useState<number>(0);
  const [yShearFactor, setYShearFactor] = useState<number>(0);

  const [minIntervalEnhancement, setMinIntervalEnhancement] =
    useState<number>(0);
  const [maxIntervalEnhancement, setMaxIntervalEnhancement] =
    useState<number>(0);

  const [enhancementIntervals, setEnhancementIntervals] = useState<Interval[]>(
    []
  );
  const [enhancementIntervalsString, setEnhancementIntervalsString] =
    useState<string>("");

  const [gamaFactor, setGamaFactor] = useState<number>(1);
  const [gamaOrEqSelected, setGamaOrEqSelected] = useState<string>("GAMA");

  const [bitSlicingFactor, setBitSlicingFactor] = useState<number>(1);
  const [highBoostFactor, setHighBoostFactor] = useState<number>(1);
  const [dotDetectionFactor, setDotDetectionFactor] = useState<number>();
  const [thresholdingGapSize, setThresholdingGapSize] = useState<number>();
  const [ponderationFactor, setPonderationFactor] = useState<number>();

  const [regionSegmentationThreshold, setRegionSegmentationThreshold] =
    useState<number>(10);
  const [seeds, setSeeds] = useState<number>(1);

  const [selectedUnity, setSelectedUnity] = useState<number>(1);

  useEffect(
    () =>
      enhancementIntervals.forEach((interval) => {
        setEnhancementIntervalsString(
          enhancementIntervalsString.concat(`[${interval.min},${interval.max}]`)
        );
      }),
    [enhancementIntervals]
  );

  const handleAddEnhancementInterval = () => {
    const newInterval: Interval = {
      min: minIntervalEnhancement,
      max: maxIntervalEnhancement,
    };

    const isIntervalAlreadyAdded = enhancementIntervals.some(
      (interval) =>
        interval.min === newInterval.min && interval.max === newInterval.max
    );

    if (!isIntervalAlreadyAdded) {
      setEnhancementIntervals((previousIntervals) => [
        ...previousIntervals,
        newInterval,
      ]);
    }
  };

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

  const executeTransformationOperation = () => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement = transformationOperation(
        props.selectedImages[0],
        transformationSelected,
        rotationFactor,
        xTranslationFactor,
        yTranslationFactor,
        xScaleFactor,
        yScaleFactor,
        xShearFactor,
        yShearFactor
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

  const executeZoomOperation = (
    operationType: ZoomOperation,
    zoomFactor: number
  ) => {
    if (props.images.length > 0) {
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

  const executeEnhancementOperation = (operationType: EnhancementOperation) => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement = enhancementOperation(
        props.selectedImages[0],
        operationType,
        enhancementIntervals
      );
      props.setImages((previousImages) => [...previousImages, operationResult]);
    }
  };

  const executeGamaCorrectionOperation = () => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement = executeGammaCorrection(
        props.selectedImages[0],
        gamaFactor
      );
      props.setImages((previousImages) => [...previousImages, operationResult]);
    }
  };

  const executeEqualizationOperation = () => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement[] = equalizationOperation(
        props.selectedImages[0]
      );
      operationResult.forEach((image) => {
        props.setImages((previousImages) => [...previousImages, image]);
      });
    }
  };

  const executeBitSlicingOperation = () => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement[] = executeBitSlicing(
        props.selectedImages[0],
        bitSlicingFactor
      );
      operationResult.forEach((image) => {
        props.setImages((previousImages) => [...previousImages, image]);
      });
    }
  };

  const executeLowPassFilterOperation = () => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement = executeLowPassFilter(
        props.selectedImages[0],
        lowPassFilterSelected
      );
      props.setImages((previousImages) => [...previousImages, operationResult]);
    }
  };

  const executeHighPassFilterOperation = () => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement = executeHighPassFilter(
        props.selectedImages[0],
        highPassFilterSelected,
        highBoostFactor
      );
      props.setImages((previousImages) => [...previousImages, operationResult]);
    }
  };

  const executeHalftoningFilterOperation = () => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement = executeHalftoning(
        props.selectedImages[0],
        halftoningFilterSelected
      );
      props.setImages((previousImages) => [...previousImages, operationResult]);
    }
  };

  const executeDotDetectionOperation = () => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement = executeDotDetection(
        props.selectedImages[0],
        dotDetectionFactor
      );
      props.setImages((previousImages) => [...previousImages, operationResult]);
    }
  };

  const executeLineDetectionOperation = () => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement = executeLineDetection(
        props.selectedImages[0],
        lineDetectionSelected
      );
      props.setImages((previousImages) => [...previousImages, operationResult]);
    }
  };

  const executeBorderDetectionOperation = () => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement = executeBorderDetection(
        props.selectedImages[0],
        borderDetectionSelected
      );
      props.setImages((previousImages) => [...previousImages, operationResult]);
    }
  };

  const executeThresholdingOperation = () => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement = executeThresholding(
        props.selectedImages[0],
        thresholdingSelected,
        thresholdingGapSize,
        ponderationFactor
      );
      props.setImages((previousImages) => [...previousImages, operationResult]);
    }
  };

  const executeRegionSegmentationOperation = () => {
    if (props.images.length > 0) {
      const operationResult: HTMLCanvasElement = executeRegionSegmentation(
        props.selectedImages[0],
        regionSegmentationThreshold,
        seeds
      );
      props.setImages((previousImages) => [...previousImages, operationResult]);
    }
  };

  const renderZoomFactorInput = (
    <>
      <TextField
        size="small"
        type="number"
        value={zoomFactor}
        onChange={(e) => setZoomFactor(e.target.value)}
        inputProps={{ min: 1 }}
      />
    </>
  );

  const renderRotationInput = (
    <>
      <TextField
        size="small"
        label="Degrees (°)"
        type="number"
        value={rotationFactor}
        onChange={(e) => setRotationFactor(e.target.value)}
      />
    </>
  );

  const renderTranslationInputs = (
    <>
      <TextField
        size="small"
        label="X distance"
        type="number"
        value={xTranslationFactor}
        onChange={(e) => setXTranslationFactor(e.target.value)}
      />
      <TextField
        size="small"
        label="Y distance"
        type="number"
        value={yTranslationFactor}
        onChange={(e) => setYTranslationFactor(e.target.value)}
      />
    </>
  );

  const renderScaleInputs = (
    <>
      <TextField
        size="small"
        label="X scale"
        type="number"
        value={xScaleFactor}
        onChange={(e) => setXScaleFactor(e.target.value)}
        inputProps={{ min: 1 }}
      />

      <TextField
        size="small"
        label="Y scale"
        type="number"
        value={yScaleFactor}
        onChange={(e) => setYScaleFactor(e.target.value)}
        inputProps={{ min: 1 }}
      />
    </>
  );

  const renderXShearInput = (
    <>
      <TextField
        size="small"
        label="Shear value"
        type="number"
        value={xShearFactor}
        onChange={(e) => setXShearFactor(e.target.value)}
      />
    </>
  );

  const renderYShearInput = (
    <>
      <TextField
        size="small"
        label="Shear value"
        type="number"
        value={yShearFactor}
        onChange={(e) => setYShearFactor(e.target.value)}
      />
    </>
  );

  const renderAddedIntervals = (
    <TextField
      size="small"
      label="Added intervals"
      value={enhancementIntervalsString}
      disabled
    />
  );

  const renderIntervalEnhancementsInputs = (
    <>
      <TextField
        size="small"
        label="Min"
        type="number"
        value={minIntervalEnhancement}
        onChange={(e) => setMinIntervalEnhancement(e.target.value)}
      />
      <TextField
        size="small"
        label="Max"
        type="number"
        value={maxIntervalEnhancement}
        onChange={(e) => setMaxIntervalEnhancement(e.target.value)}
      />
      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          fullWidth
          color="secondary"
          sx={{ textTransform: "none", fontSize: "8pt" }}
          onClick={handleAddEnhancementInterval}
          disableElevation
        >
          Add interval
        </Button>
        <Button
          variant="contained"
          fullWidth
          color="error"
          sx={{ textTransform: "none", fontSize: "8pt" }}
          onClick={() => {
            setEnhancementIntervals([]);
            setEnhancementIntervalsString("");
          }}
          disableElevation
        >
          Clear
        </Button>
      </Box>
    </>
  );

  const renderGamaFactorInput = (
    <>
      <TextField
        size="small"
        type="number"
        value={gamaFactor}
        onChange={(e) => setGamaFactor(e.target.value)}
      />
    </>
  );

  const renderBitSlicingFactorInput = (
    <>
      <TextField
        size="small"
        type="number"
        label="N° of planes"
        value={bitSlicingFactor}
        onChange={(e) => setBitSlicingFactor(e.target.value)}
        inputProps={{ min: 1 }}
      />
    </>
  );

  const renderLowPassFiltersSelect = (
    <FormControl fullWidth>
      <Select
        value={lowPassFilterSelected}
        onChange={(e) => setLowPassFilterSelected(e.target.value)}
        size="small"
      >
        <MenuItem value={LowPassFilter.MEAN_3X3}>Mean (3x3)</MenuItem>
        <MenuItem value={LowPassFilter.MEAN_5X5}>Mean (5x5)</MenuItem>
        <MenuItem value={LowPassFilter.MEDIAN_3X3}>Median (3x3)</MenuItem>
        <MenuItem value={LowPassFilter.MEDIAN_5X5}>Median (5x5)</MenuItem>
        <MenuItem value={LowPassFilter.MAXIMUM}>Maximum</MenuItem>
        <MenuItem value={LowPassFilter.MINIMUM}>Minimum</MenuItem>
        <MenuItem value={LowPassFilter.MODE}>Mode</MenuItem>
        <MenuItem value={LowPassFilter.KAWAHARA}>Kawahara</MenuItem>
        <MenuItem value={LowPassFilter.TOMIRA_TSUJI}>Tomita & Tsuji</MenuItem>
        <MenuItem value={LowPassFilter.NAGAOE_MATSUYAMA}>
          Nagaoe Matsuyama
        </MenuItem>
        <MenuItem value={LowPassFilter.SOMBOONKAEW}>Somboonkaew</MenuItem>
      </Select>
    </FormControl>
  );

  const renderHighPassFiltersSelect = (
    <FormControl fullWidth>
      <Select
        value={highPassFilterSelected}
        onChange={(e) => setHighPassFilterSelected(e.target.value)}
        size="small"
      >
        <MenuItem value={HighPassFilter.H1}>H1</MenuItem>
        <MenuItem value={HighPassFilter.H2}>H2</MenuItem>
        <MenuItem value={HighPassFilter.M1}>M1</MenuItem>
        <MenuItem value={HighPassFilter.M2}>M2</MenuItem>
        <MenuItem value={HighPassFilter.M3}>M3</MenuItem>
        <MenuItem value={HighPassFilter.HIGH_BOOST}>High boost</MenuItem>
      </Select>
    </FormControl>
  );

  const renderHighBoostFactorInput = (
    <>
      <TextField
        size="small"
        label="Factor"
        type="number"
        value={highBoostFactor}
        onChange={(e) => setHighBoostFactor(e.target.value)}
      />
    </>
  );

  const renderHalftoningFiltersSelect = (
    <FormControl fullWidth>
      <Select
        value={halftoningFilterSelected}
        onChange={(e) => setHalftoningFilterSelected(e.target.value)}
        size="small"
      >
        <MenuItem value={HalftoningFilter.ORDERED_DOT_PLOT_2X2}>
          Ordered dot plot (2x2)
        </MenuItem>
        <MenuItem value={HalftoningFilter.ORDERED_DOT_PLOT_2X3}>
          Ordered dot plot (2x3)
        </MenuItem>
        <MenuItem value={HalftoningFilter.ORDERED_DOT_PLOT_3X3}>
          Ordered dot plot (3x3)
        </MenuItem>
        <MenuItem value={HalftoningFilter.FLOYD_STEINBERG}>
          Floyd & Steinberg
        </MenuItem>
        <MenuItem value={HalftoningFilter.ROGERS}>Rogers</MenuItem>
        <MenuItem value={HalftoningFilter.JARVIS_JUDICE_NINKE}>
          Jarvis, Judice & Ninke
        </MenuItem>
        <MenuItem value={HalftoningFilter.STUCKI}>Stucki</MenuItem>
        <MenuItem value={HalftoningFilter.STEVENSONE_ARCE}>
          Stevensone Arce
        </MenuItem>
      </Select>
    </FormControl>
  );

  const renderDotDetectionInput = (
    <>
      <TextField
        size="small"
        type="number"
        placeholder="Factor"
        value={dotDetectionFactor}
        onChange={(e) => setDotDetectionFactor(e.target.value)}
      />
    </>
  );

  const renderLocalThresholdingInput = (
    <>
      <TextField
        size="small"
        type="number"
        placeholder="Gap size"
        value={thresholdingGapSize}
        onChange={(e) => setThresholdingGapSize(e.target.value)}
        inputProps={{ min: 1, max: 20 }}
      />
    </>
  );

  const renderPonderationFactorInput = (
    <>
      <TextField
        size="small"
        type="number"
        placeholder="K"
        value={ponderationFactor}
        onChange={(e) => setPonderationFactor(e.target.value)}
        inputProps={{ min: -1, max: 1 }}
      />
    </>
  );

  const firstUnitySideBar = (
    <Box height="100vh">
      <Toolbar
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Typography variant="h5" fontWeight="bold">
          1° Unity
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
        <ListItemButton
          onClick={() => setTransformationOpen(!transformationOpen)}
        >
          <ListItemIcon>
            <TransformIcon />
          </ListItemIcon>
          <ListItemText primary="Transformation" />
          {transformationOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={transformationOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Box
              sx={{
                minWidth: 120,
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <FormControl fullWidth>
                <Select
                  value={transformationSelected}
                  onChange={(e) => setTranformationSelected(e.target.value)}
                  size="small"
                >
                  <MenuItem value={TransformationOperation.ROTATION}>
                    Rotation
                  </MenuItem>
                  <MenuItem value={TransformationOperation.TRANSLATION}>
                    Translation
                  </MenuItem>
                  <MenuItem value={TransformationOperation.SCALE}>
                    Scale
                  </MenuItem>
                  <MenuItem
                    value={TransformationOperation.HORIZONTAL_REFLECTION}
                  >
                    Horizontal reflection
                  </MenuItem>
                  <MenuItem value={TransformationOperation.VERTICAL_REFLECTION}>
                    Vertical reflection
                  </MenuItem>
                  <MenuItem value={TransformationOperation.X_SHEAR}>
                    X shear
                  </MenuItem>
                  <MenuItem value={TransformationOperation.Y_SHEAR}>
                    Y shear
                  </MenuItem>
                </Select>
              </FormControl>
              {transformationSelected === TransformationOperation.ROTATION
                ? renderRotationInput
                : transformationSelected === TransformationOperation.TRANSLATION
                ? renderTranslationInputs
                : transformationSelected === TransformationOperation.SCALE
                ? renderScaleInputs
                : transformationSelected === TransformationOperation.X_SHEAR
                ? renderXShearInput
                : transformationSelected === TransformationOperation.Y_SHEAR
                ? renderYShearInput
                : null}
              <Button
                variant="contained"
                fullWidth
                sx={{ textTransform: "none" }}
                onClick={executeTransformationOperation}
                disableElevation
              >
                Apply operation
              </Button>
            </Box>
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
          <Box
            sx={{
              minWidth: 120,
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <Select
                value={zoomSelected}
                onChange={(e) => setZoomSelected(e.target.value)}
                size="small"
              >
                <MenuItem value={ZoomOperation.REPLICATION}>
                  Replication (Zoom IN)
                </MenuItem>
                <MenuItem value={ZoomOperation.INTERPOLATION}>
                  Interpolation (Zoom IN)
                </MenuItem>
                <MenuItem value={ZoomOperation.DELETION}>
                  Deletion (Zoom OUT)
                </MenuItem>
                <MenuItem value={ZoomOperation.MEAN_VALUE}>
                  Mean value (Zoom OUT)
                </MenuItem>
              </Select>
            </FormControl>
            {renderZoomFactorInput}
            <Button
              variant="contained"
              fullWidth
              sx={{ textTransform: "none" }}
              onClick={() => executeZoomOperation(zoomSelected, zoomFactor)}
              disableElevation
            >
              Apply operation
            </Button>
          </Box>
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
        <ListItemButton
          onClick={() => setPseudocoloringOpen(!pseudocoloringOpen)}
        >
          <ListItemIcon>
            <InvertColorsIcon />
          </ListItemIcon>
          <ListItemText primary="Pseudocoloring" />
          {pseudocoloringOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={pseudocoloringOpen} timeout="auto" unmountOnExit>
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
      <Divider />
      <List>
        <ListItemButton onClick={() => setEnhancementsOpen(!enhancementsOpen)}>
          <ListItemIcon>
            <AutoAwesomeIcon />
          </ListItemIcon>
          <ListItemText primary="Enhancements" />
          {enhancementsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={enhancementsOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              minWidth: 120,
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {enhancementSelected === EnhancementOperation.INTERVAL
              ? renderAddedIntervals
              : null}
            <FormControl fullWidth>
              <Select
                value={enhancementSelected}
                onChange={(e) => setEnhancementSelected(e.target.value)}
                size="small"
              >
                <Typography sx={{ pl: 2, mt: 1 }} fontWeight="bold">
                  Linear:
                </Typography>
                <MenuItem value={EnhancementOperation.INTERVAL}>
                  Interval
                </MenuItem>
                <MenuItem value={EnhancementOperation.BINARY}> Binary</MenuItem>
                <MenuItem value={EnhancementOperation.REVERSE}>
                  Reverse
                </MenuItem>
                <Typography sx={{ pl: 2, mt: 1 }} fontWeight="bold">
                  Non-linear:
                </Typography>
                <MenuItem value={EnhancementOperation.LOG}>
                  Logarithmic
                </MenuItem>
                <MenuItem value={EnhancementOperation.SQUARE_ROOT}>
                  Square root
                </MenuItem>
                <MenuItem value={EnhancementOperation.EXPONENTIAL}>
                  Exponential
                </MenuItem>
                <MenuItem value={EnhancementOperation.SQUARED}>
                  Squared
                </MenuItem>
              </Select>
            </FormControl>
            {enhancementSelected === EnhancementOperation.INTERVAL
              ? renderIntervalEnhancementsInputs
              : null}
            <Button
              variant="contained"
              fullWidth
              sx={{ textTransform: "none" }}
              onClick={() => executeEnhancementOperation(enhancementSelected)}
              disableElevation
            >
              Apply operation
            </Button>
          </Box>
        </Collapse>
      </List>
    </Box>
  );

  const secondUnitySideBar = (
    <Box height="100vh">
      <Toolbar
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Typography variant="h5" fontWeight="bold">
          2° Unity
        </Typography>
      </Toolbar>

      <Divider />
      <List>
        <ListItemButton onClick={() => setGamaAndEqOpen(!gamaAndEqOpen)}>
          <ListItemIcon>
            <EqualizerIcon />
          </ListItemIcon>
          <ListItemText primary="Gama & equalization" />
          {gamaAndEqOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={gamaAndEqOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              minWidth: 120,
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <Select
                value={gamaOrEqSelected}
                onChange={(e) => setGamaOrEqSelected(e.target.value)}
                size="small"
              >
                <MenuItem value="GAMA">Gama correction</MenuItem>
                <MenuItem value="EQ">Equalization</MenuItem>
              </Select>
            </FormControl>
            {gamaOrEqSelected === "GAMA" ? renderGamaFactorInput : null}
            <Button
              variant="contained"
              fullWidth
              sx={{ textTransform: "none" }}
              onClick={
                gamaOrEqSelected === "GAMA"
                  ? executeGamaCorrectionOperation
                  : executeEqualizationOperation
              }
              disableElevation
            >
              Apply operation
            </Button>
          </Box>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={() => setBitSlicingOpen(!bitSlicingOpen)}>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Bit slicing" />
          {bitSlicingOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={bitSlicingOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              minWidth: 120,
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {renderBitSlicingFactorInput}
            <Button
              variant="contained"
              fullWidth
              sx={{ textTransform: "none" }}
              onClick={executeBitSlicingOperation}
              disableElevation
            >
              Apply operation
            </Button>
          </Box>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={() => setFiltersOpen(!filtersOpen)}>
          <ListItemIcon>
            <PhotoFilterIcon />
          </ListItemIcon>
          <ListItemText primary="Filters" />
          {filtersOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={filtersOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              minWidth: 120,
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <Select
                value={filterTypeSelected}
                onChange={(e) => setFilterTypeSelected(e.target.value)}
                size="small"
              >
                <MenuItem value="LOW">Low-pass</MenuItem>
                <MenuItem value="HIGH">High-pass</MenuItem>
                <MenuItem value="HALF">Halftonings</MenuItem>
              </Select>
            </FormControl>
            {filterTypeSelected == "LOW"
              ? renderLowPassFiltersSelect
              : filterTypeSelected == "HIGH"
              ? renderHighPassFiltersSelect
              : renderHalftoningFiltersSelect}
            {filterTypeSelected == "HIGH" &&
            highPassFilterSelected == HighPassFilter.HIGH_BOOST
              ? renderHighBoostFactorInput
              : null}
            <Button
              variant="contained"
              fullWidth
              sx={{ textTransform: "none" }}
              disableElevation
              onClick={() => {
                if (filterTypeSelected === "LOW") {
                  executeLowPassFilterOperation();
                } else if (filterTypeSelected == "HIGH") {
                  executeHighPassFilterOperation();
                } else if (filterTypeSelected == "HALF") {
                  executeHalftoningFilterOperation();
                }
              }}
            >
              Apply operation
            </Button>
          </Box>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={() => setDotDetectionOpen(!dotDetectionOpen)}>
          <ListItemIcon>
            <WorkspacesIcon />
          </ListItemIcon>
          <ListItemText primary="Dot detection" />
          {dotDetectionOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={dotDetectionOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              minWidth: 120,
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {renderDotDetectionInput}
            <Button
              variant="contained"
              fullWidth
              sx={{ textTransform: "none" }}
              disableElevation
              onClick={executeDotDetectionOperation}
            >
              Apply operation
            </Button>
          </Box>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItemButton
          onClick={() => setLineDetectionOpen(!lineDetectionOpen)}
        >
          <ListItemIcon>
            <GridGoldenratioIcon />
          </ListItemIcon>
          <ListItemText primary="Line detection" />
          {lineDetectionOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={lineDetectionOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              minWidth: 120,
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <Select
                value={lineDetectionSelected}
                onChange={(e) => setLineDetectionSelected(e.target.value)}
                size="small"
              >
                <MenuItem value={LineDetectionFilter.HORIZONTAL}>
                  Horizontal
                </MenuItem>
                <MenuItem value={LineDetectionFilter.VERTICAL}>
                  Vertical
                </MenuItem>
                <MenuItem value={LineDetectionFilter.DEGREES_45}>45°</MenuItem>
                <MenuItem value={LineDetectionFilter.DEGREES_135}>
                  135°
                </MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              fullWidth
              sx={{ textTransform: "none" }}
              disableElevation
              onClick={executeLineDetectionOperation}
            >
              Apply operation
            </Button>
          </Box>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItemButton
          onClick={() => setBorderDetectionOpen(!borderDetectionOpen)}
        >
          <ListItemIcon>
            <BorderStyleIcon />
          </ListItemIcon>
          <ListItemText primary="Border detection" />
          {borderDetectionOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={borderDetectionOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              minWidth: 120,
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <Select
                value={borderDetectionSelected}
                onChange={(e) => setBorderDetectionSelected(e.target.value)}
                size="small"
              >
                <MenuItem value={BorderDetectionFilter.ROBERTS}>
                  Roberts
                </MenuItem>
                <MenuItem value={BorderDetectionFilter.CROSSED_ROBERTS}>
                  Crossed Roberts
                </MenuItem>
                <MenuItem value={BorderDetectionFilter.PREWIIT_GX}>
                  Prewiit Gx
                </MenuItem>
                <MenuItem value={BorderDetectionFilter.PREWIIT_GY}>
                  Prewiit Gy
                </MenuItem>
                <MenuItem value={BorderDetectionFilter.MAGNITUDE_PREWIIT}>
                  Magnitude Prewiit
                </MenuItem>
                <MenuItem value={BorderDetectionFilter.SOBEL_GX}>
                  Sobel Gx
                </MenuItem>
                <MenuItem value={BorderDetectionFilter.SOBEL_GY}>
                  Sobel Gy
                </MenuItem>
                <MenuItem value={BorderDetectionFilter.MAGNITUDE_SOBEL}>
                  Magnitude Sobel
                </MenuItem>
                <MenuItem value={BorderDetectionFilter.KRISH}>Krish</MenuItem>
                <MenuItem value={BorderDetectionFilter.ROBINSON}>
                  Robinson
                </MenuItem>
                <MenuItem value={BorderDetectionFilter.FREY_CHEN}>
                  Frey-Chen
                </MenuItem>
                <MenuItem value={BorderDetectionFilter.LAPLACIAN_H1}>
                  H1 Laplacian
                </MenuItem>
                <MenuItem value={BorderDetectionFilter.LAPLACIAN_H2}>
                  H2 Laplacian
                </MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              fullWidth
              sx={{ textTransform: "none" }}
              disableElevation
              onClick={executeBorderDetectionOperation}
            >
              Apply operation
            </Button>
          </Box>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={() => setThresholdingOpen(!thresholdingOpen)}>
          <ListItemIcon>
            <DataThresholdingIcon />
          </ListItemIcon>
          <ListItemText primary="Thresholding" />
          {thresholdingOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={thresholdingOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              minWidth: 120,
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <Select
                value={thresholdingSelected}
                onChange={(e) => setThresholdingSelected(e.target.value)}
                size="small"
              >
                <MenuItem value={ThresholdingType.GLOBAL}>Global</MenuItem>
                <MenuItem value={ThresholdingType.LOCAL_AVERAGE}>
                  Local average
                </MenuItem>
                <MenuItem value={ThresholdingType.LOCAL_MEDIAN}>
                  Local median
                </MenuItem>
                <MenuItem value={ThresholdingType.LOCAL_MIN_MAX}>
                  Local Min&Max
                </MenuItem>
                <MenuItem value={ThresholdingType.NI_BLACK}>Niblack</MenuItem>
              </Select>
            </FormControl>
            {thresholdingSelected != ThresholdingType.GLOBAL
              ? renderLocalThresholdingInput
              : null}
            {thresholdingSelected == ThresholdingType.NI_BLACK
              ? renderPonderationFactorInput
              : null}
            <Button
              variant="contained"
              fullWidth
              sx={{ textTransform: "none" }}
              disableElevation
              onClick={executeThresholdingOperation}
            >
              Apply operation
            </Button>
          </Box>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItemButton
          onClick={() => setRegionSegmentationOpen(!regionSegmentationOpen)}
        >
          <ListItemIcon>
            <GroupWorkIcon />
          </ListItemIcon>
          <ListItemText primary="Region segmentation" />
          {regionSegmentationOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={regionSegmentationOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              minWidth: 120,
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              size="small"
              type="number"
              placeholder="Threshold"
              value={regionSegmentationThreshold}
              onChange={(e) => setRegionSegmentationThreshold(e.target.value)}
            />
            <TextField
              size="small"
              type="number"
              placeholder="Seeds"
              value={seeds}
              onChange={(e) => setSeeds(e.target.value)}
              inputProps={{ min: 1 }}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ textTransform: "none" }}
              disableElevation
              onClick={executeRegionSegmentationOperation}
            >
              Apply operation
            </Button>
          </Box>
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
          backgroundColor: "#11151C",
          boxShadow: "none",
          border: "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" noWrap component="div" fontWeight="bold">
            Workspace
          </Typography>
          <Box>
            <Button
              variant="contained"
              disableElevation
              onClick={() => setSelectedUnity(0)}
            >
              1° unity
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={() => setSelectedUnity(1)}
            >
              2° unity
            </Button>
          </Box>
          <Box display="flex" alignItems="center">
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
          {selectedUnity === 0 ? firstUnitySideBar : secondUnitySideBar}
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
          {selectedUnity === 0 ? firstUnitySideBar : secondUnitySideBar}
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
