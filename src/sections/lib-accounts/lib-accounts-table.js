import { format, parseISO } from 'date-fns';
import {
  Box,
  Card,
  Chip
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Scrollbar } from 'src/components/scrollbar';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import { alpha, styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import globalAxios from '../../axios/index';
import ConfirmDialog from 'src/components/confirmDialog';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LibAccountsEdit from './lib-accounts-edit';


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

const fetchAccountsData = async () => {
  return await globalAxios.get('libraries/accounts/fetch');
}


export const LibAccountsTable = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [accountsEditOpen, setAccountsEditOpen] = useState(false);
  const [accountId, setAccountId] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();

  const handleRefetch = () => {
    queryClient.invalidateQueries('accounts');
  };

  const columns = [
    {
      field: 'id',
      headerName: '',
      renderCell: (params) => {
        return <div>
          <IconButton aria-label="delete" onClick={() => {
            setConfirmOpen(true);
            setAccountId(params.value);
          }}>
            <DeleteIcon fontSize="small" />
          </IconButton>

          <IconButton aria-label="edit" onClick={() => {
            setAccountsEditOpen(true);
            setAccountId(params.value);
          }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </div>
      }
    },
    {
      field: 'uacs_object_code',
      headerName: 'UACS Object Code',
      minWidth: 150,
    },
    {
      field: 'account_title',
      headerName: 'Account Title',
      flex: 1,
      minWidth: 300,
    },
    {
      field: 'rca_code',
      headerName: 'RCA Code',
      minWidth: 100,
    },
    {
      field: 'uacs_subobject_code',
      headerName: 'UACS Subobject Code',
      width: 110,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 90,
      renderCell: (params) => {
        if (params.value) {
          return <Chip label="active" color="primary" />
        } else {
          return <Chip label="inactive" color="danger" />
        }
      }
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: 200,
      renderCell: (params) => (
        <span>
          {format(parseISO(params.value), 'MMM d, Y h:mm a')}
        </span>
      ),
    },
  ];

  const { data, error, isLoading } = useQuery(['accounts'], fetchAccountsData, {
    refetchOnWindowFocus: false
  });

  const { mutate } = useMutation((values) => {
    const response = globalAxios.post(`libraries/accounts/delete/${values}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${window.sessionStorage.getItem('token')}`,
      },
    });

    return response;

  }, {
    onSuccess: data => {
      if (!data) throw Error;
      enqueueSnackbar(data?.data.status, {
        variant: 'success', anchorOrigin: { horizontal: 'center', vertical: 'top' }, autoHideDuration: 3000
      });
      handleRefetch();
    },
    onError: () => {
      enqueueSnackbar('Something went wrong! Please try again.', {
        variant: 'error', anchorOrigin: { horizontal: 'center', vertical: 'top' }, autoHideDuration: 3000
      });
    }
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card>
      <ConfirmDialog
        title="Delete Account?"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={() => {
          mutate(accountId);
        }}
      >
        Are you sure you want to delete this account?
      </ConfirmDialog>
      <LibAccountsEdit
        open={accountsEditOpen}
        setOpen={setAccountsEditOpen}
        id={accountId} />
      <Scrollbar>
        <Box sx={{ minWidth: 800, padding: 2 }}>
          <StripedDataGrid
            loading={isLoading}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            rows={data?.data || []}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
          />
        </Box>
      </Scrollbar>
    </Card>
  )
};
