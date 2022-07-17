import { styled } from "@mui/material/styles";

export const Backdrop = styled("div")(({ theme }) => ({
  zIndex: theme.zIndex.drawer - 1,
  width: "100vw",
  height: "100vh",
  position: "fixed",
  backgroundColor: "black",
  animation: `fadeIn 500ms ease`,
  opacity: 0.2,
  "@keyframes fadeIn": {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 0.2,
    },
  },
}));
