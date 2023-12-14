import * as React from 'react';
import { useEffect, useState } from 'react';
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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const GjEdit = (props) => {
    const { open, setOpen, data } = props;
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const formik = useFormik({
        initialValues: {
            sheet_no: '',
            month: '',
            year: '',
            remarks: ''
        },
        validationSchema: Yup.object({
            sheet_no: Yup
                .string()
                .max(255)
                .required('Sheet is required'),
            month: Yup
                .string()
                .max(255)
                .required('Month is required'),
            year: Yup
                .string()
                .max(255)
                .required('Year is required'),
            remarks: Yup
                .string()
                .required('Remarks is required')
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

    useEffect(() => {
        formik.resetForm({
            values: {
                sheet_no: data?.sheet_no || '',
                month: data?.month || '',
                year: data?.year || '',
                remarks: data?.remarks || '',
            },
        });
    }, [data, formik.resetForm]);


    const handleRefetch = () => {
        queryClient.invalidateQueries('gj');
    };

    const handleClose = () => {
        setOpen(false);
    };


    const { mutate, isLoading } = useMutation((values) => {
        const response = globalAxios.post(`general_journal/journal/update/${data?.id}`, values, {
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
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
                maxWidth={'sm'}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Edit Journal
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
                        <Grid sx={{ p: 1 }}>
                            <TextField
                                sx={{ mt: 1 }}
                                fullWidth
                                label="Sheet"
                                name="sheet_no"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.sheet_no}
                                error={!!(formik.touched.sheet_no && formik.errors.sheet_no)}
                                helperText={formik.touched.sheet_no && formik.errors.sheet_no}
                                required
                            />
                        </Grid>

                        <Grid container>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ p: 1 }}

                            >
                                <FormControl fullWidth variant="filled" required>
                                    <InputLabel id="select-month-label">Month</InputLabel>
                                    <Select
                                        labelId="select-month-label"
                                        id="select-month"
                                        label="Month"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.month}
                                        name="month" // Add the "name" prop to match the field name in initialValues
                                        error={formik.touched.month && Boolean(formik.errors.month)}
                                    >
                                        <MenuItem value=''><em>None</em></MenuItem>
                                        <MenuItem value='January'>January</MenuItem>
                                        <MenuItem value='February'>February</MenuItem>
                                        <MenuItem value='March'>March</MenuItem>
                                        <MenuItem value='April'>April</MenuItem>
                                        <MenuItem value='May'>May</MenuItem>
                                        <MenuItem value='June'>June</MenuItem>
                                        <MenuItem value='July'>July</MenuItem>
                                        <MenuItem value='August'>August</MenuItem>
                                        <MenuItem value='September'>September</MenuItem>
                                        <MenuItem value='October'>October</MenuItem>
                                        <MenuItem value='November'>November</MenuItem>
                                        <MenuItem value='December'>December</MenuItem>
                                    </Select>
                                    {formik.touched.month && (
                                        <FormHelperText error>{formik.errors.month}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ p: 1 }}

                            >
                                <FormControl fullWidth variant="filled" required>
                                    <InputLabel

                                        id="select-year-label">Year</InputLabel>
                                    <Select
                                        labelId="select-year-label"
                                        id="select-year"
                                        label="Year"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.year}
                                        name="year" // Add the "name" prop to match the field name in initialValues
                                        error={formik.touched.year && Boolean(formik.errors.year)}
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <MenuItem value='2022'>2022</MenuItem>
                                        <MenuItem value='2023'>2023</MenuItem>
                                        <MenuItem value='2024'>2024</MenuItem>
                                        <MenuItem value='2025'>2025</MenuItem>
                                        <MenuItem value='2026'>2026</MenuItem>
                                        <MenuItem value='2027'>2027</MenuItem>
                                        <MenuItem value='2028'>2028</MenuItem>
                                        <MenuItem value='2029'>2029</MenuItem>
                                        <MenuItem value='2030'>2030</MenuItem>
                                    </Select>
                                    {formik.touched.year && (
                                        <FormHelperText error>{formik.errors.year}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid sx={{ p: 1 }}>
                            <TextField
                                sx={{ mt: 1 }}
                                fullWidth
                                label="Remarks"
                                name="remarks"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.remarks}
                                placeholder='Indicate if it is adjustment, non-cash, or remittances'
                                multiline
                                minRows={3}
                                error={formik.touched.remarks && Boolean(formik.errors.remarks)}
                                required
                            />
                        </Grid>

                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button variant='contained' autoFocus onClick={formik.handleSubmit}>
                        Update
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}

export default GjEdit;