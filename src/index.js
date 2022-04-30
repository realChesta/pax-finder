import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createTheme, ThemeProvider} from "@mui/material";

const theme = createTheme({
    palette: {
        mode: 'dark'
    }
});

const Root = () => {

    return (
        <ThemeProvider theme={theme}>
            <App/>
        </ThemeProvider>
    );
};

ReactDOM.render(<Root/>,
    document.getElementById('root')
);

