import * as React from 'react';
import { useMutation } from "@tanstack/react-query";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import TextField from '@mui/material/TextField';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import { Alert, Box, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SvgIcon } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import globalAxios from '../../axios/index';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { SaveAltOutlined } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const fetchAccountData = async (id) => {
    if (id) return await globalAxios.get(`libraries/accounts/fetch/${id}`);
}


const LibAccountsEdit = (props) => {
    const { open, setOpen, id } = props;
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    let data = null;


    const formik = useFormik({
        initialValues: {
            uacs_object_code: data?.uacs_object_code,
            account_title: data?.account_title,
            rca_code: data?.rca_code,
            uacs_subobject_code: data?.uacs_subobject_code,
        },
        validationSchema: Yup.object({
            uacs_object_code: Yup
                .number()
                .required('UACS Object Code is required'),
            account_title: Yup
                .string()
                .required('Account Title is required'),
            rca_code: Yup
                .number()
                .required('RCA Code is required'),
            uacs_subobject_code: Yup
                .number()
                .required('UACS Sub-object Code is required'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                mutate(values);
            } catch (err) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        }
    });


    const handleRefetch = () => {
        queryClient.invalidateQueries('accounts');
    };

    if (open) {
        console.log(id);
        fetchAccountData(id).then((res) => {
            console.log(res);
        });
    }



    const handleClose = () => {
        setOpen(false);
    };



    // const { mutate, isLoading } = useMutation((values) => {
    //     const response = globalAxios.post('libraries/accounts/create', values, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Token ${window.sessionStorage.getItem('token')}`,
    //         },
    //     });

    //     return response;

    // }, {
    //     onSuccess: data => {
    //         if (!data) throw Error;
    //         enqueueSnackbar(data?.data.status, {
    //             variant: 'success', anchorOrigin: { horizontal: 'center', vertical: 'top' }, autoHideDuration: 3000
    //         });
    //         handleRefetch();
    //         handleClose();
    //     },
    //     onError: () => {
    //         enqueueSnackbar('Something went wrong! Please try again.', {
    //             variant: 'error', anchorOrigin: { horizontal: 'center', vertical: 'top' }, autoHideDuration: 3000
    //         });
    //     }
    // });

    return (
        <div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth={'sm'}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Edit Accounts
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
                    <Box
                        component="form"
                    >
                        <Grid container>
                            <Grid item xs={12} sx={{ p: 1 }}>
                                <TextField
                                    fullWidth
                                    label="UACS Object Code"
                                    name="uacs_object_code"
                                    type='number'
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.uacs_object_code}
                                    error={!!(formik.touched.uacs_object_code && formik.errors.uacs_object_code)}
                                    helperText={formik.touched.uacs_object_code && formik.errors.uacs_object_code}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ p: 1 }}>
                                <TextField
                                    fullWidth
                                    label="Account Title"
                                    name="account_title"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.account_title}
                                    error={!!(formik.touched.account_title && formik.errors.account_title)}
                                    helperText={formik.touched.account_title && formik.errors.account_title}
                                    required
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ p: 1 }}

                            >
                                <TextField
                                    fullWidth
                                    label="RCA Code"
                                    name="rca_code"
                                    type='number'
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.rca_code}
                                    error={!!(formik.touched.rca_code && formik.errors.rca_code)}
                                    helperText={formik.touched.rca_code && formik.errors.rca_code}
                                    required
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ p: 1 }}

                            >
                                <TextField
                                    fullWidth
                                    label="UACS Sub-object Code"
                                    name="uacs_subobject_code"
                                    type='number'
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.uacs_subobject_code}
                                    error={!!(formik.touched.uacs_subobject_code && formik.errors.uacs_subobject_code)}
                                    helperText={formik.touched.uacs_subobject_code && formik.errors.uacs_subobject_code}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Box>

                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        // loading={isLoading}
                        loadingPosition="start"
                        startIcon={<SaveAltOutlined />}
                        variant="contained"
                        autoFocus onClick={formik.handleSubmit}
                    >
                        Update
                    </LoadingButton>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}

export default LibAccountsEdit;