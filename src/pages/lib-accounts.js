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

import LibAccountsAdd from 'src/sections/lib-accounts/lib-accounts-add';

const Page = () => {
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
                    py: 8,
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
                                    <LibAccountsImport />
                                </Stack>
                            </Stack>
                            <div>
                                <LibAccountsAdd />
                            </div>
                        </Stack>
                        <LibAccountsTable />
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
