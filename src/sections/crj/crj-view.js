import { useState, useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import TextField from '@mui/material/TextField';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import { Alert, Box, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SvgIcon, AppBar, Toolbar, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import globalAxios from '../../axios/index';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { SaveAltOutlined } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
        backgroundColor: theme.palette.grey[200],
        '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
        '&.Mui-selected': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
            '&:hover, &.Mui-hovered': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    ODD_OPACITY +
                    theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity,
                ),
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        ODD_OPACITY + theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    },
}));

const CRJView = (props) => {
    const { open, setOpen, data } = props;
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const handleClose = () => {
        setOpen(false);
    };

    const columns = [
        { field: 'rcd', headerName: 'RCD/ CRReg No.', minWidth: 120 },
        { field: 'jev_no', headerName: 'JEV No.', minWidth: 120 },
        { field: 'name_of_collecting_officer', headerName: 'Name of Collecting Officer', minWidth: 150 },
        { field: 'col_debit_amount', headerName: 'Amount' },
        { field: 'col_debit_uacs_object_code', headerName: 'UACS Object Code' },
        { field: 'col_credit_or_no', headerName: 'OR #' },
        { field: 'col_credit_transaction', headerName: 'Transaction', minWidth: 500 },
        { field: 'col_credit_payor', headerName: 'Payor', minWidth: 200 },
        { field: 'col_credit_uacs_name', headerName: 'UACS Name', minWidth: 200 },
        { field: 'col_credit_sundry_uacs_object_code', headerName: 'UACS Object Code', minWidth: 120 },
        { field: 'col_credit_sundry_p', headerName: 'P' },
        { field: 'col_credit_sundry_amount', headerName: 'Amount' },
        { field: 'dep_debit_deposited_account', headerName: 'Deposited Account', minWidth: 270 },
        { field: 'dep_date_of_deposit', headerName: 'Date of Deposit', minWidth: 120 },
        { field: 'dep_debit_sundry_uacs_object_code', headerName: 'UACS Object Code', minWidth: 120 },
        { field: 'dep_debit_sundry_p', headerName: 'P' },
        { field: 'dep_debit_sundry_amount', headerName: 'Amount' },
        { field: 'dep_credit_uacs_object_code', headerName: 'UACS Object Code' },
        { field: 'dep_credit_amount', headerName: 'Amount' },
    ];

    return (
        <div>
            <BootstrapDialog
                fullScreen
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth={'sm'}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2 }} variant="h6" component="div">
                            {data?.crj.sheet_no} | {data?.crj.month} {data?.crj.year}
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <StripedDataGrid
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                    }
                    rows={data?.receipts_journal || []}
                    columns={columns}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                    hideFooter
                />
            </BootstrapDialog>
        </div>
    );
}

export default CRJView;