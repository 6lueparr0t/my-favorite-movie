import { PropsWithChildren } from "react";
import { Outlet } from "react-router";
import { ThemeProvider } from "@/components/custom/theme-provider";

import { RecoilRoot } from "recoil";
import { FavoritePersistenceObserver } from "@/store/favorite";

const Root: React.FC<PropsWithChildren> = () => {
  return (
    <RecoilRoot>
      <FavoritePersistenceObserver />
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <main>
          <Outlet />
        </main>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default Root;
