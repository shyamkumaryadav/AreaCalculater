import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
} from "react";
import type { Route } from "./+types/home";
import { cn } from "~/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Area Calculator" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const defaultHectareToBigha = 3.9537;
const defaultBighaToBiswa = 20;

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "placeholder:text-muted-foreground mt-1 placeholder:capitalize selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export default function Home() {
  const [hectare, setHectare] = useState("");
  const [bigha, setBigha] = useState("");
  const [biswa, setBiswa] = useState("");

  // Conversion factors
  const [hectareToBigha, setHectareToBigha] = useState(defaultHectareToBigha);
  const [bighaToBiswa, setBighaToBiswa] = useState(defaultBighaToBiswa);

  const [showSettings, setShowSettings] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedHectareToBigha = localStorage.getItem("hectareToBigha");
    const storedBighaToBiswa = localStorage.getItem("bighaToBiswa");

    if (storedHectareToBigha)
      setHectareToBigha(parseFloat(storedHectareToBigha));
    if (storedBighaToBiswa) setBighaToBiswa(parseFloat(storedBighaToBiswa));
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    function handleClickOutside(event: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    }
    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside, {
        signal: abortController.signal,
      });
    }
    return () => {
      abortController.abort();
    };
  }, [showSettings]);

  useEffect(() => {
    localStorage.setItem("hectareToBigha", hectareToBigha.toString());
    localStorage.setItem("bighaToBiswa", bighaToBiswa.toString());
  }, [hectareToBigha, bighaToBiswa]);

  const handleHectareChange = (e: ChangeEvent<HTMLInputElement>) => {
    const h = parseFloat(e.target.value);
    setHectare(e.target.value);

    if (!isNaN(h)) {
      setBigha((h * hectareToBigha).toFixed(4));
      setBiswa((h * hectareToBigha * bighaToBiswa).toFixed(4));
    } else {
      setBigha("");
      setBiswa("");
    }
  };

  const handleBighaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const b = parseFloat(e.target.value);
    setBigha(e.target.value);

    if (!isNaN(b)) {
      setHectare((b / hectareToBigha).toFixed(4));
      setBiswa((b * bighaToBiswa).toFixed(4));
    } else {
      setHectare("");
      setBiswa("");
    }
  };

  const handleBiswaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const bs = parseFloat(e.target.value);
    setBiswa(e.target.value);

    if (!isNaN(bs)) {
      setBigha((bs / bighaToBiswa).toFixed(4));
      setHectare((bs / (hectareToBigha * bighaToBiswa)).toFixed(4));
    } else {
      setBigha("");
      setHectare("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg relative">
      <button
        onClick={() => setShowSettings((val) => !val)}
        className="absolute top-3 right-3 co text-gray-600 hover:text-gray-900 transition-transform duration-300 hover:rotate-180"
        title="Settings"
      >
        ⚙️
      </button>
      <h2 className="text-xl font-semibold mb-4 text-center">
        Area Conversion Calculator
      </h2>

      {/* Hectare Input */}
      <div className="mb-4">
        <label className="block text-gray-700">
          Hectare{" "}
          <Input
            type="number"
            value={hectare}
            onChange={handleHectareChange}
            placeholder="Enter area in hectare"
          />
        </label>
      </div>

      {/* Bigha Input */}
      <div className="mb-4">
        <label className="block text-gray-700">
          Bigha{" "}
          <Input
            type="number"
            value={bigha}
            onChange={handleBighaChange}
            placeholder="Enter area in bigha"
          />
        </label>
      </div>

      {/* Biswa Input */}
      <div className="mb-4">
        <label className="block text-gray-700">
          Biswa
          <Input
            type="number"
            value={biswa}
            name="biswa"
            onChange={handleBiswaChange}
            placeholder="Enter area in biswa"
          />
        </label>
      </div>
      {showSettings && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-xs flex items-center justify-center z-50">
          <div
            ref={settingsRef}
            className="bg-white p-6 rounded-lg shadow-lg w-80"
          >
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm">
                1 Hectare = ? Bigha
                <Input
                  type="number"
                  value={hectareToBigha}
                  name="hectareToBigha"
                  onChange={(e) =>
                    setHectareToBigha(parseFloat(e.target.value) || 0)
                  }
                  autoFocus
                />
              </label>
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 text-sm">
                1 Bigha = ? Biswa
                <Input
                  type="number"
                  value={bighaToBiswa}
                  name="bighaToBiswa"
                  onChange={(e) =>
                    setBighaToBiswa(parseFloat(e.target.value) || 0)
                  }
                />
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSettings(false)}
                className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setHectareToBigha(defaultHectareToBigha);
                  setBighaToBiswa(defaultBighaToBiswa);
                  setBigha("");
                  setHectare("");
                  setBiswa("");
                  setShowSettings(false);
                }}
                className="bg-orange-500 text-white py-1 px-2 rounded-md hover:bg-orange-600"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
