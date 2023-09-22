import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Switch,
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

export const LibAccountsTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => { },
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = []
  } = props;

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  Uacs Object Code
                </TableCell>
                <TableCell>
                  Account Title
                </TableCell>
                <TableCell>
                  RCA Code
                </TableCell>
                <TableCell>
                  Uacs Subject Code
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Created At
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((libAccounts) => {
                const isSelected = selected.includes(libAccounts.id);
                const createdAt = format(parseISO(libAccounts.created_at), 'MMM d, Y h:mm a');

                return (
                  <TableRow
                    hover
                    key={libAccounts.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(libAccounts.id);
                          } else {
                            onDeselectOne?.(libAccounts.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {libAccounts.uacs_object_code}
                    </TableCell>
                    <TableCell>
                      {libAccounts.account_title}
                    </TableCell>
                    <TableCell>
                      {libAccounts.rca_code}
                    </TableCell>
                    <TableCell>
                      {libAccounts.uacs_subobject_code}
                    </TableCell>
                    <TableCell>
                      <Switch checked={libAccounts.status} />
                    </TableCell>
                    <TableCell>
                      {createdAt}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

LibAccountsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
