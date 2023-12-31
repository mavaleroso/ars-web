import * as React from 'react';
import { useCallback, useState } from 'react';
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

export default function CrjImport() {
    const [open, setOpen] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const handleRefetch = () => {
        queryClient.invalidateQueries('crj');
    };

    const formik = useFormik({
        initialValues: {
            attachment: null,
            sheet: '',
            month: '',
            year: '',
            remarks: ''
        },
        validationSchema: Yup.object({
            attachment: Yup
                .mixed()
                .required('Please select a file')
                .test('fileType', 'Invalid file type', (value) =>
                    value && ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(value.type)
                ),
            sheet: Yup
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
                .nullable()
                .notRequired()
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


    const { mutate, isLoading } = useMutation((values) => {
        const response = globalAxios.post('receipts_journal/import', values, {
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

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


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
                fullWidth
                maxWidth={'sm'}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Import CRJ
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
                    <Alert severity="info">Upload excel file for CRJ based on its format. You can also download the <a href="/files/crj-sample.xlsx">sample format</a> provided.</Alert>
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
                                required
                            />
                            <TextField
                                sx={{ mt: 1 }}
                                fullWidth
                                label="Sheet"
                                name="sheet"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.sheet}
                                error={!!(formik.touched.sheet && formik.errors.sheet)}
                                helperText={formik.touched.sheet && formik.errors.sheet}
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
                                multiline
                                minRows={3}
                            />
                        </Grid>

                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button variant='contained' autoFocus onClick={formik.handleSubmit}>
                        Import
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}