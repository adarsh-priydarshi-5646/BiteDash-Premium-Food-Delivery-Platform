/**
 * ownerSlice Tests - Redux owner/shop state management
 * 
 * Tests: Initial state, setMyShopData action
 * Covers: Shop data storage for restaurant owners
 */
import { describe, it, expect } from 'vitest';
import ownerReducer, { setMyShopData } from '../ownerSlice';

describe('ownerSlice', () => {
    it('should handle initial state', () => {
        expect(ownerReducer(undefined, { type: 'unknown' })).toEqual({
            myShopData: null
        });
    });

    it('should handle setMyShopData', () => {
        const shop = { name: 'My Shop', items: [] };
        const state = ownerReducer(undefined, setMyShopData(shop));
        expect(state.myShopData).toEqual(shop);
    });
});
