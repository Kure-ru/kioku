import { Paper } from "@mantine/core"
import { ReactNode } from "react"
import classes from './GlassPaper.module.css';

interface GlassPaperProps {
  children: ReactNode;
}

const GlassPaper = ({ children }: GlassPaperProps) => {
  return (
    <Paper className={classes.paper}>
      {children}
    </Paper>
  )
}

export default GlassPaper