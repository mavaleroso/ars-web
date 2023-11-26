import * as React from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography, Card, OutlinedInput, InputAdornment, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import GjTable from 'src/sections/gj/gj-table';
import GjImport from 'src/sections/gj/gj-import';

const Page = () => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Head>
                <title>
                    GJ | ARS
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    General Journal
                                </Typography>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                    <GjImport />
                                    <Button
                                        color="inherit"
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <ArrowDownOnSquareIcon />
                                            </SvgIcon>
                                        )}
                                    >
                                        Export
                                    </Button>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Card sx={{ p: 2 }}>
                            <OutlinedInput
                                defaultValue=""
                                fullWidth
                                placeholder="Search general Journal"
                                startAdornment={(
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            color="action"
                                            fontSize="small"
                                        >
                                            <MagnifyingGlassIcon />
                                        </SvgIcon>
                                    </InputAdornment>
                                )}
                                sx={{ maxWidth: 500 }}
                            />
                        </Card>
                        <Card sx={{ p: 2 }}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                                        <Tab label="Overview" value="1" />
                                        <Tab label="Import History" value="2" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1">
                                    <GjTable />
                                </TabPanel>
                                <TabPanel value="2">Item Two</TabPanel>
                            </TabContext>
                        </Card>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
