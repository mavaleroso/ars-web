import { format, parseISO } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import { alpha, styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import globalAxios from '../../axios/index';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConfirmDialog from 'src/components/confirmDialog';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CRJView from './crj-view';

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

const fetchCRJ = async () => {
  return await globalAxios.get('receipts_journal/crj/fetch');
}

export const CrjTable = () => {
  const [CRJEditOpen, setCRJEditOpen] = useState(false);
  const [CRJData, setCRJData] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [CRJID, setCRJID] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const handleRefetch = () => {
    queryClient.invalidateQueries('crj');
  };


  const fetchCRJData = async (id) => {
    return await globalAxios.get(`receipts_journal/fetch/${id}`);
  }

  const handleFetchCRJ = (id) => {
    fetchCRJData(id).then(res => {
      setCRJData(res.data);
      setCRJEditOpen(true);
    });
  }


  const columns = [
    {
      field: 'id',
      headerName: '',
      minWidth: 120,
      renderCell: (params) => {
        return <div>
          <IconButton aria-label="delete" onClick={() => {
            setConfirmOpen(true);
            setCRJID(params.value);
          }}>
            <DeleteIcon fontSize="small" />
          </IconButton>

          <IconButton aria-label="edit" onClick={() => {
            // handleFetchAccount(params.value);
          }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="view" onClick={() => {
            handleFetchCRJ(params.value);
          }}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </div>
      }
    },
    {
      field: 'sheet_no',
      headerName: 'Sheet No',
      minWidth: 300,
    },
    {
      field: 'month',
      headerName: 'Month',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'year',
      headerName: 'Year',
      minWidth: 100,
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      width: 200,
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

  const { data, error, isLoading } = useQuery(['crj'], fetchCRJ, {
    refetchOnWindowFocus: false
  });

  const { mutate } = useMutation((values) => {
    let response = null;
    switch (values?.type) {
      case 'delete':
        response = globalAxios.post(`receipts_journal/delete/${values?.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${window.sessionStorage.getItem('token')}`,
          },
        });
        break;
      case 'update':
        response = globalAxios.post(`receipts_journal/crj/update/${values?.id}`, values, {
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

  return (
    <Card>
      <ConfirmDialog
        title="Delete CRJ?"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={() => {
          mutate({ id: CRJID, type: 'delete' });
        }}
      >
        Are you sure you want to delete this account?
      </ConfirmDialog>
      <CRJView
        open={CRJEditOpen}
        setOpen={setCRJEditOpen}
        data={CRJData} />
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
  );
};
