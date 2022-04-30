import logo from './logo.svg';
import './App.css';
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader, Checkbox, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    TextField,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import {css} from "@emotion/react";
import {useEffect, useState} from "react";
import PaxTable from "./components/PaxTable";
import apis from "./utils/apis";

function App() {
    const theme = useTheme();
    const styles = {
        appContainer: css`
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 100vw;
          min-height: 100vh;
          color: ${theme.palette.text.primary};
          padding: 1em;
          box-sizing: border-box;
        `
    };
    const [paxNum, setPaxNum] = useState('');
    const [zip, setZip] = useState('8052');
    const [usedNum, setUsedNum] = useState(null);
    const [stores, setStores] = useState([]);
    const [storeWhitelist, setStoreWhitelist] = useState([]);

    useEffect(() => {
        (async () => {
            const s = await apis.misc.getStoresInfo();
            setStores(s);
            setStoreWhitelist(s.map(i => i.id));
        })();
    }, []);

    const toggleEntry = (id) => {
        let newList = storeWhitelist.slice();
        if (newList.includes(id)) {
            newList.splice(newList.indexOf(id), 1);
            setStoreWhitelist(newList);
        } else {
            newList.push(id);
            setStoreWhitelist(newList);
        }
    }

    const storeItems = stores.map(s => (
        <ListItem>
            <ListItemButton onClick={() => toggleEntry(s.id)}>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        disableRipple
                        checked={storeWhitelist.includes(s.id)}
                    />
                </ListItemIcon>
                <ListItemText primary={`${s.name} (${s.displayName})`}/>
            </ListItemButton>
        </ListItem>
    ));

    return (
        <Box sx={styles.appContainer}>
            <Card sx={{margin: '1em', overflow: 'visible'}}>
                <CardHeader title="IKEA PAX Finder"/>
                <CardContent>
                    <List dense>
                        {storeItems}
                    </List>
                    <br/>
                    <Grid container spacing={2} direction="row" alignItems="center">
                        <Grid item xs={6}>
                            <TextField
                                fullWidth label="PAX Number"
                                value={paxNum} onChange={e => setPaxNum(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth label="ZIP"
                                value={zip} onChange={e => setZip(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button color="primary" onClick={() => setUsedNum(paxNum)}>
                                Check
                            </Button>
                        </Grid>
                    </Grid>
                    <br/>
                    <PaxTable config={usedNum} zip={zip} stores={stores} whitelist={storeWhitelist}/>
                </CardContent>
            </Card>
        </Box>
    );
}

export default App;
