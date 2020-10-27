import { createMuiTheme } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";

const theme = createMuiTheme({
    typography: {
        useNextVariants: true
    },
    palette: {
        primary: {
            light: '#4fb099',
            main: '#28ccb9',
            dark: '#14665d',
            contrastText: "#fff"
        },
        secondary: {
            light: '#ffc17a',
            main: '#ff9924',
            dark: '#63421c',
            contrastText: "#000"
        },
        openTitle: '#2f46bc',
        protectedTitle: blue['400'],
        type: 'light'
    }
});

export default theme;