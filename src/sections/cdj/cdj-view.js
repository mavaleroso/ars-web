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

const CDJView = (props) => {
    const { open, setOpen, data } = props;
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const handleClose = () => {
        setOpen(false);
    };

    const columns = [
        {
            field: 'recon_no',
            headerName: 'Recon No',
            flex: 1
        },
        {
            field: 'seq',
            headerName: 'SEQ',
            flex: 1
        },
        {
            field: 'month',
            headerName: 'Month',
            flex: 1
        },
        {
            field: 'date',
            headerName: 'Date',
            flex: 1
        },
        {
            field: 'year',
            headerName: 'Year',
            flex: 1
        },
        {
            field: 'check_no',
            headerName: 'Check No',
            minWidth: 80,
            flex: 1
        },
        {
            field: 'dv_year',
            headerName: 'DV Yr.',
            flex: 1
        },
        {
            field: 'dv_month',
            headerName: 'DV Mn.',
            flex: 1
        },
        {
            field: 'dv_no',
            headerName: 'DV No.',
            minWidth: 80,
            flex: 1
        },
        {
            field: 'source',
            headerName: 'Source',
            minWidth: 80,
            flex: 1
        },
        {
            field: 'payee',
            headerName: 'Payee',
            minWidth: 200,
            flex: 1
        },
        {
            field: 'nature_of_payment',
            headerName: 'Nature of Payment',
            minWidth: 800,
            flex: 1
        },
        {
            field: 'check_tmp',
            headerName: 'Check',
            editable: true,
        },
        {
            field: 'cash',
            headerName: 'Cash',
            editable: true,
        },
        {
            field: 'tax',
            headerName: 'Tax',
            editable: true,
        },
        {
            field: 'tax_percent',
            headerName: '%',
            editable: true,

        },
        {
            field: 'tax2',
            headerName: 'Tax 2',
            editable: true,

        },
        {
            field: 'tax2_percent',
            headerName: '%',
            editable: true,

        },
        {
            field: 'remittance',
            headerName: 'Remittance',
            editable: true,

        },
        {
            field: 'rod',
            headerName: 'ROD',
        },
        {
            field: 'cash_position',
            headerName: 'Cash Position',
        },
        {
            field: 'ppa',
            headerName: 'PPA',
        },
        {
            field: 'charge_center',
            headerName: 'Charge Center',
        },
        {
            field: 'set',
            headerName: 'Set',
        },
        {
            field: 'purpose',
            headerName: 'Purpose',
        },
        {
            field: 'fund',
            headerName: 'Fund',
        },
        {
            field: 'account_code',
            headerName: 'Account Code',
        },
        {
            field: 'old_code',
            headerName: 'Old Code',
        },
        {
            field: 'alobs_year',
            headerName: 'Alobs Yr.',
        },
        {
            field: 'alobs_month',
            headerName: ' Alobs Mn.',
        },
        {
            field: 'alobs_no',
            headerName: 'Alobs No.',
        },
        {
            field: 'sa_aamt',
            headerName: 'SAA amt.',
        },
        {
            field: 'earmark',
            headerName: 'Earmark',
        },
        {
            field: 'debit',
            headerName: 'Debit',
        },
        {
            field: 'credit',
            headerName: 'Credit',
        },
        {
            field: 'ap_charge_from',
            headerName: 'AP charge from',
        },
        {
            field: 'old_code2',
            headerName: 'Old Code2',
        },
        {
            field: 'payment_remarks',
            headerName: 'Payment Remarks',
        },
        {
            field: 'budget_code',
            headerName: 'Budget Code',
        },
        {
            field: 'expense_class',
            headerName: 'Expense Class',
        },
        {
            field: 'authorization',
            headerName: 'Authorization',
        },
        {
            field: 'bur_ap',
            headerName: 'BUR AP',
        },
        {
            field: 'type',
            headerName: 'Type',
        },
        {
            field: 'quarter',
            headerName: 'Quarter',
        },
        {
            field: 'saa_no',
            headerName: 'Saa No.',
        },
        {
            field: 'rao_ref',
            headerName: 'RAO Ref',
        },
        {
            field: 'uacs_description',
            headerNames: 'Uacs Description',
        },
        {
            field: 'cmf_dr',
            headerName: 'CMF DR',
        },
        {
            field: 'bur',
            headerName: 'BUR',
        },
        {
            field: 'aa',
            headerName: 'AA',
        },
        {
            field: 'dd_nyd',
            headerName: 'DD NYD',
        }
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
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {data?.cdj.description} | {data?.cdj.month} {data?.cdj.year}
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
                    rows={data?.disbursement_journal || []}
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

export default CDJView;