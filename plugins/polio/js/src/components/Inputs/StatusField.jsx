import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

export const StatusField = () => {
    return (
        <FormControl fullWidth variant='outlined'>
            <InputLabel id='status-label-id'>Status</InputLabel>
            <Select
                label='Status'
                labelId='status-label-id'
                id='status-field-id'
            >
                <MenuItem value='PENDING'>Pending</MenuItem>
                <MenuItem value='ONGOING'>Ongoing</MenuItem>
                <MenuItem value='FINISHED'>Finished</MenuItem>
            </Select>
        </FormControl>
    );
};
