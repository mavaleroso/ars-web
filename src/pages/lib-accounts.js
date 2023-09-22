import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { applyPagination } from 'src/utils/apply-pagination';
import { LibAccountsSearch } from 'src/sections/lib-accounts/lib-accounts-search';
import { LibAccountsTable } from 'src/sections/lib-accounts/lib-accounts-table';
import LibAccountsImport from 'src/sections/lib-accounts/lib-accounts-import';
import { useQuery } from '@tanstack/react-query';
import globalAxios from '../axios/index';
import LibAccountsAdd from 'src/sections/lib-accounts/lib-accounts-add';

const now = new Date();

const fetchAccountsData = async () => {
    return await globalAxios.get('libraries/accounts/fetch');
}

const useLibAccounts = (data, page, rowsPerPage) => {
    return useMemo(
        () => {
            return applyPagination(data, page, rowsPerPage);
        },
        [page, rowsPerPage]
    );
};

const useLibAccountsIds = (libAccounts) => {
    return useMemo(
        () => {
            return libAccounts.map((libAccounts) => libAccounts.id);
        },
        [libAccounts]
    );
};


const Page = () => {

    const { data, error, isLoading, refetch } = useQuery(['accounts'], fetchAccountsData, {
        refetchOnWindowFocus: false
    });


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const libAccounts = useLibAccounts(data?.data || [], page, rowsPerPage);
    const libAccountsIds = useLibAccountsIds(libAccounts);
    const libAccountsSelection = useSelection(libAccountsIds);

    const handlePageChange = useCallback(
        (event, value) => {
            setPage(value);
        },
        []
    );

    const handleRowsPerPageChange = useCallback(
        (event) => {
            setRowsPerPage(event.target.value);
        },
        []
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }


    return (
        <>
            <Head>
                <title>
                    Accounts | ARS
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
                                    List of Accounts
                                </Typography>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                    <LibAccountsImport handleClick={refetch} />
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
                            <div>
                                <LibAccountsAdd />
                            </div>
                        </Stack>
                        <LibAccountsSearch />
                        <LibAccountsTable
                            count={data.data.length}
                            items={libAccounts}
                            onDeselectAll={libAccountsSelection.handleDeselectAll}
                            onDeselectOne={libAccountsSelection.handleDeselectOne}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectAll={libAccountsSelection.handleSelectAll}
                            onSelectOne={libAccountsSelection.handleSelectOne}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            selected={libAccountsSelection.selected}
                        />
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
