import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Badge,
    Chip,
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip
} from "@mui/material";
import apis from "../utils/apis";
import format from '../utils/format';
import moment from "moment";

const PaxTable = props => {
    const [paxItems, setPaxItems] = useState([]);

    useEffect(() => {
        console.log(props.config);
        if (props.config && props.config.length) {
            (async () => {
                const pis = await apis.pax.getArticlesFromPaxCode(props.config);
                const details = await apis.item.getItemDetails(pis.map(p => p.itemNo));
                const availabilities = await apis.item.getItemAvailabilities(pis.map(p => p.itemNo), props.zip);
                for (let d of details) {
                    d.amount = pis.find(p => p.itemNo === d.itemKey.itemNo).quantity;
                    d.availability = availabilities.filter(a => a.itemKey.itemNo === d.itemKey.itemNo);
                }
                setPaxItems(details);
                console.log(details);
            })();
        } else {
            setPaxItems([]);
        }
    }, [props.config]);

    const rows = paxItems.map(pi => {

        let delivery = pi.availability.find(a => a.classUnitKey.classUnitType === 'RU');

        let deliveryChip;
        if (delivery.availableForHomeDelivery) {
            deliveryChip = (
                <Badge badgeContent={delivery.buyingOption.homeDelivery.availability.quantity} color="primary">
                    <Chip variant="outlined" label="Yes" color="primary"/>
                </Badge>
            );
        } else {
            deliveryChip = <Chip label="No" variant="outlined" color="secondary"/>
        }


        let storeChips = [];
        for (let store of pi.availability.filter(a => a.classUnitKey.classUnitType === 'STO')) {
            if (!props.whitelist.includes(store.classUnitKey.classUnitCode)) continue;

            let chip;
            let restock = false;
            if (store.buyingOption.cashCarry.availability.restocks &&
                store.buyingOption.cashCarry.availability.restocks.length > 0) {
                restock = store.buyingOption.cashCarry.availability.restocks[0];
            }

            if (store.availableForCashCarry) {
                let badgeStr = store.buyingOption.cashCarry.availability.quantity.toString();
                if (restock) {
                    badgeStr += '*';
                }
                chip = (
                    <Badge
                        color="primary"
                        badgeContent={badgeStr}
                        key={store.classUnitKey.classUnitCode}
                        sx={{margin: '0.5em'}}
                    >
                        <Chip
                            label={format.getStoreName(props.stores, store.classUnitKey.classUnitCode)}
                            variant="outlined" color="primary"
                        />
                    </Badge>
                );
            } else if (restock) {
                chip = (
                    <Badge
                        color="secondary"
                        badgeContent={restock.quantity}
                        key={store.classUnitKey.classUnitCode}
                        sx={{margin: '0.5em'}}
                    >
                        <Chip
                            label={format.getStoreName(props.stores, store.classUnitKey.classUnitCode)}
                            variant="outlined" color="secondary"
                        />
                    </Badge>
                );
            }

            if (restock) {
                let str = `restock of ${restock.quantity} incoming ${moment(restock.earliestDate).format('D.M.')} - ${moment(restock.latestDate).format('D.M.')}`
                chip = (
                    <Tooltip title={str}>
                        {chip}
                    </Tooltip>
                );
            }

            storeChips.push(chip);
        }


        return (
            <TableRow key={pi.itemKey.itemNo} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                <TableCell component="th" scope="row">
                    <Link
                        href={`https://www.ikea.com/ch/en/p/-${pi.itemKey.itemNo}/`}
                        underline="none" color="inherit" target="_blank" rel="noreferrer">
                        {format.formatItemName(pi)}
                    </Link>
                </TableCell>
                <TableCell align="right">{format.formatItemNumber(pi.itemKey.itemNo)}</TableCell>
                <TableCell align="right">{pi.amount}</TableCell>
                <TableCell align="right">{deliveryChip}</TableCell>
                <TableCell align="right">{storeChips}</TableCell>
            </TableRow>
        );
    });

    return (
        <TableContainer component={Paper} variant="outlined" sx={{overflowX: 'inherit'}}>
            <Table sx={{minWidth: 800}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="right">Number</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Delivery?</TableCell>
                        <TableCell align="right">In-Store</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

PaxTable.propTypes = {};

export default PaxTable;