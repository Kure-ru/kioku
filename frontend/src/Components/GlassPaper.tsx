import { Paper } from "@mantine/core"
import { ReactNode } from "react"
import classes from './GlassPaper.module.css';

interface GlassPaperProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

const GlassPaper = ({ children, style }: GlassPaperProps) => {
  return (
    <Paper className={classes.paper} style={style}>
      {children}
    </Paper>
  )
}

export default GlassPaper