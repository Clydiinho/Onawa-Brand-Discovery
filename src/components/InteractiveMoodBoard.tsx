import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { MoodBoardData, MoodBoardElement } from "../types";
import {
  Palette,
  Type,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  Download,
  Upload,
  RotateCw,
  Layers,
  HelpCircle,
  Plus,
  Check,
  Compass,
  FileCode2,
  Eye
} from "lucide-react";

interface InteractiveMoodBoardProps {
  brandName: string;
  moodBoard: MoodBoardData;
  onChange: (updated: MoodBoardData) => void;
}

const BRAND_FONT_OPTIONS = [
  { name: "Playfair Display", category: "Serif / Elegance" },
  { name: "Space Grotesk", category: "Monospace / Cyber" },
  { name: "Syne", category: "Display / Experimental" },
  { name: "Montserrat", category: "Sans-Serif / Clean" },
  { name: "Cinzel", category: "Luxury / Classical" },
  { name: "Inter", category: "Modern / Minimalist" },
];

const SWATCH_PRESETS = [
  "#D4A574", // Electric Volt
  "#F5F0E8", // Cyber Cyan
  "#0F172A", // Dark Slate
  "#FF002B", // Neon Crimson
  "#F8FAFC", // Off White
  "#334155", // Slate Mid
  "#A855F7", // Neon Purple
  "#3B82F6", // Royal Blue
];

export const InteractiveMoodBoard: React.FC<InteractiveMoodBoardProps> = ({
  brandName,
  moodBoard,
  onChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedFont, setSelectedFont] = useState("Space Grotesk");
  const [customText, setCustomText] = useState(brandName || "Onawa Brand Vibe");
  const [selectedHex, setSelectedHex] = useState("#D4A574");
  const [showStrategistNote, setShowStrategistNote] = useState(true);

  // Initialize Fabric.js Canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 550;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#020617",
      selection: true,
    });

    fabricCanvasRef.current = canvas;

    // Load initial mood board elements if present
    if (moodBoard.elements && moodBoard.elements.length > 0) {
      moodBoard.elements.forEach((elem) => {
        if (elem.type === "color") {
          const rect = new fabric.Rect({
            left: elem.x,
            top: elem.y,
            fill: elem.content,
            width: 120,
            height: 120,
            rx: 16,
            ry: 16,
            stroke: "#334155",
            strokeWidth: 2,
            angle: elem.angle || 0,
            scaleX: elem.scaleX || 1,
            scaleY: elem.scaleY || 1,
          });

          const text = new fabric.Text(elem.content.toUpperCase(), {
            fontSize: 14,
            fontFamily: "monospace",
            fill: "#ffffff",
            left: elem.x + 15,
            top: elem.y + 85,
          });

          const group = new fabric.Group([rect, text], {
            left: elem.x,
            top: elem.y,
            angle: elem.angle || 0,
          });

          canvas.add(group);
        } else if (elem.type === "text") {
          const textObj = new fabric.Text(elem.content, {
            left: elem.x,
            top: elem.y,
            fontFamily: elem.fontFamily || "Space Grotesk",
            fontSize: 32,
            fill: elem.content.startsWith("#") ? elem.content : "#D4A574",
            angle: elem.angle || 0,
            scaleX: elem.scaleX || 1,
            scaleY: elem.scaleY || 1,
          });
          canvas.add(textObj);
        } else if (elem.type === "image") {
          fabric.FabricImage.fromURL(elem.content, {
            crossOrigin: "anonymous",
          }).then((imgObj) => {
            imgObj.set({
              left: elem.x,
              top: elem.y,
              angle: elem.angle || 0,
              scaleX: elem.scaleX || 0.4,
              scaleY: elem.scaleY || 0.4,
            });
            canvas.add(imgObj);
            canvas.renderAll();
          }).catch((err) => console.warn("Image load warning:", err));
        }
      });
    } else {
      // Add default starter elements for visual delight
      const starterText = new fabric.Text(brandName ? `${brandName.toUpperCase()} IDENTITY` : "FUTURE BRAND DIRECTION", {
        left: 50,
        top: 40,
        fontFamily: "Space Grotesk",
        fontSize: 28,
        fontWeight: "bold",
        fill: "#D4A574",
      });
      canvas.add(starterText);

      // Starter Swatch
      const swatch = new fabric.Rect({
        left: 50,
        top: 120,
        fill: "#F5F0E8",
        width: 140,
        height: 140,
        rx: 16,
        ry: 16,
        stroke: "#ffffff",
        strokeWidth: 2,
      });

      const swatchText = new fabric.Text("#F5F0E8\nCYBER CYAN", {
        fontSize: 12,
        fontFamily: "monospace",
        fill: "#020617",
        left: 65,
        top: 165,
        fontWeight: "bold",
      });

      const group = new fabric.Group([swatch, swatchText], { left: 50, top: 120 });
      canvas.add(group);
    }

    canvas.renderAll();

    // Event listener to sync snapshot to state
    const handleCanvasModified = () => {
      saveCanvasState(canvas);
    };

    canvas.on("object:modified", handleCanvasModified);
    canvas.on("object:added", handleCanvasModified);
    canvas.on("object:removed", handleCanvasModified);

    // Responsive window resize
    const handleResize = () => {
      if (!containerRef.current || !fabricCanvasRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      fabricCanvasRef.current.setDimensions({ width: newWidth, height: 550 });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, []);

  // Save Canvas Objects and High-Res Snapshot
  const saveCanvasState = (canvas: fabric.Canvas) => {
    try {
      const dataUrl = canvas.toDataURL({
        format: "png",
        quality: 0.95,
        multiplier: 1.5,
      });

      const objects = canvas.getObjects();
      const elements: MoodBoardElement[] = objects.map((obj, idx) => ({
        id: `elem_${idx}_${Date.now()}`,
        type: obj.type === "image" ? "image" : obj.type === "group" ? "color" : "text",
        content: (obj as any).text || (obj as any).fill || "object",
        fontFamily: (obj as any).fontFamily,
        x: obj.left || 0,
        y: obj.top || 0,
        scaleX: obj.scaleX || 1,
        scaleY: obj.scaleY || 1,
        angle: obj.angle || 0,
      }));

      onChange({
        elements,
        canvasSnapshotDataUrl: dataUrl,
      });
    } catch (e) {
      console.warn("Failed to capture mood board snapshot:", e);
    }
  };

  // Add Color Swatch to Board
  const handleAddColorSwatch = (hex: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const rect = new fabric.Rect({
      left: 100 + Math.random() * 80,
      top: 100 + Math.random() * 80,
      fill: hex,
      width: 130,
      height: 130,
      rx: 16,
      ry: 16,
      stroke: "#ffffff",
      strokeWidth: 2,
    });

    const label = new fabric.Text(hex.toUpperCase(), {
      fontSize: 13,
      fontFamily: "monospace",
      fill: hex === "#F8FAFC" || hex === "#D4A574" || hex === "#F5F0E8" ? "#020617" : "#ffffff",
      left: 115,
      top: 155,
      fontWeight: "bold",
    });

    const group = new fabric.Group([rect, label], {
      left: 120 + Math.random() * 100,
      top: 120 + Math.random() * 100,
    });

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
    saveCanvasState(canvas);
  };

  // Add Typography Sample to Board
  const handleAddTypographyText = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !customText) return;

    const textObj = new fabric.Text(customText, {
      left: 80 + Math.random() * 120,
      top: 80 + Math.random() * 120,
      fontFamily: selectedFont,
      fontSize: 32,
      fill: selectedHex || "#D4A574",
    });

    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();
    saveCanvasState(canvas);
  };

  // Handle Image Upload onto Fabric Canvas
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgDataUrl = event.target?.result as string;
      const canvas = fabricCanvasRef.current;
      if (!canvas || !imgDataUrl) return;

      fabric.FabricImage.fromURL(imgDataUrl).then((imgObj) => {
        // Auto-scale large images
        const maxDim = 250;
        const scale = Math.min(maxDim / (imgObj.width || 300), maxDim / (imgObj.height || 300));

        imgObj.set({
          left: 150 + Math.random() * 100,
          top: 100 + Math.random() * 100,
          scaleX: scale,
          scaleY: scale,
          cornerColor: "#D4A574",
          cornerStrokeColor: "#020617",
          borderColor: "#F5F0E8",
          cornerStyle: "circle",
        });

        canvas.add(imgObj);
        canvas.setActiveObject(imgObj);
        canvas.renderAll();
        saveCanvasState(canvas);
      });
    };
    reader.readAsDataURL(file);
  };

  // Delete Selected Element
  const handleDeleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const activeObjs = canvas.getActiveObjects();
    if (activeObjs.length > 0) {
      activeObjs.forEach((obj) => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
      saveCanvasState(canvas);
    }
  };

  // Clear Canvas
  const handleClearCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.clear();
    canvas.set("backgroundColor", "#020617");
    canvas.renderAll();
    saveCanvasState(canvas);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      {/* SECTION HEADER */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-mono font-black text-cream uppercase tracking-widest">
          <Palette className="w-4 h-4 text-cream" />
          <span>Stage 10 • Interactive Fabric.js Mood Board</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-cream tracking-tight">
          Visual Direction &amp; Aesthetic Canvas
        </h1>
        <p className="text-xs md:text-sm text-cream/80 leading-relaxed font-medium">
          Custom interactive workspace for Onawa Studio clients. Upload brand imagery, pin hex color palettes, and test Google typography in real-time.
        </p>
      </div>

      {/* CLYDE'S STRATEGIST PERSPECTIVE SIDEBAR */}
      <div className="p-4 bg-graphite rounded-2xl border border-cream/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-cream/10 border border-cream/30 rounded-xl text-cream shrink-0">
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono font-bold text-cream uppercase tracking-wider">
              Clyde’s Perspective:
            </span>
            <p className="text-xs sm:text-sm text-cream font-semibold italic leading-relaxed">
              "This is where we share the ownership of your brand's aesthetic. Move, rotate, and layer these elements to show me the vibe of your future."
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-cream/60 shrink-0 border-l md:border-l border-white/5 pl-3">
          17+ Years Experience • Onawa Studio
        </div>
      </div>

      {/* CONTROLS TOOLBAR & CANVAS WRAPPER */}
      <div className="p-6 bg-graphite rounded-2xl border border-white/20 shadow-xl flex flex-col gap-6">
        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-b border-white/5 pb-6">
          {/* Tool 1: Upload Imagery */}
          <div className="flex flex-col gap-2.5 p-4 bg-surface/90 rounded-xl border border-white/5">
            <span className="text-xs font-extrabold text-cream uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              <span>1. Add Brand Imagery</span>
            </span>
            <p className="text-[11px] text-cream/70">
              Upload logo concepts, mood photos, or texture references.
            </p>

            <label className="cursor-pointer py-2 px-3 bg-surface hover:bg-graphite border border-white/10 hover:border-cream/30 text-cream/80 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
              <Upload className="w-3.5 h-3.5 text-cream" />
              <span>Upload Image File</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Tool 2: Pin Color Palette Swatches */}
          <div className="flex flex-col gap-2.5 p-4 bg-surface/90 rounded-xl border border-white/5">
            <span className="text-xs font-extrabold text-brass uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4" />
              <span>2. Pin Color Swatches</span>
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedHex}
                onChange={(e) => setSelectedHex(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-white/10"
              />
              <input
                type="text"
                value={selectedHex}
                onChange={(e) => setSelectedHex(e.target.value)}
                className="w-24 px-2 py-1 bg-graphite border border-white/10 text-cream font-mono text-xs rounded-lg uppercase"
              />
              <button
                type="button"
                onClick={() => handleAddColorSwatch(selectedHex)}
                className="px-3 py-1 bg-brass hover:bg-brass-hover text-carbon-black font-black text-xs rounded-lg transition-all"
              >
                + Pin
              </button>
            </div>

            {/* Quick Swatch Presets */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {SWATCH_PRESETS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => handleAddColorSwatch(hex)}
                  className="w-6 h-6 rounded-md border border-white/20 hover:scale-110 transition-transform shadow-sm"
                  style={{ backgroundColor: hex }}
                  title={`Pin ${hex}`}
                />
              ))}
            </div>
          </div>

          {/* Tool 3: Typography & Brand Name Sandbox */}
          <div className="flex flex-col gap-2.5 p-4 bg-surface/90 rounded-xl border border-white/5">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-4 h-4" />
              <span>3. Test Google Fonts</span>
            </span>

            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Brand Name or Tagline"
              className="w-full px-2.5 py-1.5 bg-graphite border border-white/10 text-cream text-xs rounded-lg"
            />

            <div className="flex items-center gap-2">
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full px-2 py-1 bg-graphite border border-white/10 text-cream/80 text-xs rounded-lg"
              >
                {BRAND_FONT_OPTIONS.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name} ({f.category})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddTypographyText}
                className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-cream font-bold text-xs rounded-lg shrink-0 transition-all"
              >
                + Add
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface/60 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-xs text-cream/70 font-mono">
            <Layers className="w-4 h-4 text-cream" />
            <span>Click any object on canvas to move, rotate, resize or layer</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Selected</span>
            </button>

            <button
              type="button"
              onClick={handleClearCanvas}
              className="px-3 py-1.5 bg-surface hover:bg-graphite border border-white/10 text-cream/60 hover:text-cream font-mono text-xs rounded-lg transition-all"
            >
              Clear Canvas
            </button>
          </div>
        </div>

        {/* FULL WIDTH FABRIC CANVAS CONTAINER */}
        <div
          ref={containerRef}
          className="relative w-full rounded-2xl border-2 border-white/5 overflow-hidden shadow-2xl bg-graphite min-h-[550px]"
        >
          <canvas ref={canvasRef} />
        </div>

        {/* Mandatory Footer */}
        <div className="pt-2 border-t border-white/5 text-center">
          <p className="text-[11px] font-mono font-bold text-cream/60 uppercase tracking-widest">
            Custom tool for Onawa Studio clients • Simon Sinek’s Golden Circle + Clyde Strydom’s 17+ years experience
          </p>
        </div>
      </div>
    </div>
  );
};
