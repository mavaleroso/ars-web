import * as React from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import { Alert, Box, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SvgIcon } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import globalAxios from '../../axios/index';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import ImportExportIcon from '@mui/icons-material/ImportExport';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


export default function LibAccountsImport() {
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = React.useState(false);
    const queryClient = useQueryClient();

    const handleRefetch = () => {
        queryClient.invalidateQueries('accounts');
    };

    const formik = useFormik({
        initialValues: {
            attachment: null,
        },
        validationSchema: Yup.object({
            attachment: Yup
                .mixed()
                .required('Please select a file')
                .test('fileType', 'Invalid file type', (value) =>
                    value && ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(value.type)
                ),
        }),
        onSubmit: async (values, helpers) => {
            try {

                // importAccounts({ excel: values.attachment });
                mutate(values);

            } catch (err) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        }
    });

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const { mutate, isLoading } = useMutation((values) => {
        const response = globalAxios.post('libraries/accounts/import', values, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Token ${window.sessionStorage.getItem('token')}`,
            },
        });

        return response;

    }, {
        onSuccess: data => {
            if (!data) throw Error;
            enqueueSnackbar(data.data.status, {
                variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' }, autoHideDuration: 3000
            });
            handleRefetch();
            handleClose();
        },
        onError: () => {
            enqueueSnackbar('Something went wrong! Please try again.', {
                variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'bottom' }, autoHideDuration: 3000
            });
        }
    });

    return (
        <div>
            <Button color="inherit"
                startIcon={(
                    <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                    </SvgIcon>
                )}
                onClick={handleClickOpen}>
                Import
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth={'sm'}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Import Accounts
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Alert severity="info">Upload excel file for List of Accounts based on its format. You can also download the sample format provided below.</Alert>
                    <Box
                        component="form"
                    >
                        <Grid sx={{ p: 1 }}>
                            <TextField
                                autoFocus
                                fullWidth
                                margin="dense"
                                id="excel-input"
                                type="file"
                                variant="outlined"
                                inputProps={{ accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" }}
                                onChange={(event) => {
                                    formik.setFieldValue('attachment', event.currentTarget.files[0]);
                                }}
                                onBlur={formik.handleBlur}
                                error={formik.touched.attachment && Boolean(formik.errors.attachment)}
                                helperText={formik.touched.attachment && formik.errors.attachment}
                            />
                        </Grid>

                    </Box>

                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        loading={isLoading}
                        loadingPosition="start"
                        startIcon={<ImportExportIcon />}
                        variant="contained"
                        autoFocus onClick={formik.handleSubmit}
                    >
                        Import
                    </LoadingButton>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}