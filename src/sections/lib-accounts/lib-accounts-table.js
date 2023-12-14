import { format, parseISO } from 'date-fns';
import {
  Box,
  Card,
  Switch
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
import { useEffect, useState } from 'react';
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
  const [accountData, setAccountData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();

  const handleRefetch = () => {
    queryClient.invalidateQueries('accounts');
  };

  const fetchAccountData = async (id) => {
    return await globalAxios.get(`libraries/accounts/fetch/${id}`);
  }

  const handleFetchAccount = (id) => {
    fetchAccountData(id).then(res => {
      console.log(res.data);
      setAccountData(res.data);
      setAccountsEditOpen(true);
    });
  }

  const handleStatusChange = (values) => {
    mutate({ id: values?.id, status: values?.status ? 0 : 1, type: 'update' });
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
            handleFetchAccount(params.value);
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
        return <Switch checked={params.value ? true : false} onClick={() => handleStatusChange(params.row)} />
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
    let response = null;
    switch (values?.type) {
      case 'delete':
        response = globalAxios.post(`libraries/accounts/delete/${values?.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${window.sessionStorage.getItem('token')}`,
          },
        });
        break;
      case 'update':
        response = globalAxios.post(`libraries/accounts/update/${values?.id}`, values, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${window.sessionStorage.getItem('token')}`,
          },
        });
        break;
      default:
        break;
    }

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
          mutate({ id: accountId, type: 'delete' });
        }}
      >
        Are you sure you want to delete this account?
      </ConfirmDialog>
      <LibAccountsEdit
        open={accountsEditOpen}
        setOpen={setAccountsEditOpen}
        data={accountData} />
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
