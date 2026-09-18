import "@expo/metro-runtime";
import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { App } from "expo-router/build/qualified-entry";
import { renderRootComponent } from "expo-router/build/renderRootComponent";

LoadSkiaWeb({
  locateFile: (file) => {
    if (file === "canvaskit.wasm") {
      return "canvaskit.wasm";
    }
    return file;
  },
}).then(() => {
  renderRootComponent(App);
});