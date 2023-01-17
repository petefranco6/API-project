import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"

export const getAllSpots = createAsyncThunk(
    "/api/spots/all",
    async () => {
        const response = await fetch("/api/spots");
        const data = await response.json();
        return data;
    }
)

const spotsSlice = createSlice({
    name:"spots",
    initialState: {spots:[]},
    extraReducers: (builder) => {
        builder.addCase(getAllSpots.fulfilled, (state, action) => {
            state.spots = action.payload.Spots;
        })
    }
})

export default spotsSlice.reducer;
