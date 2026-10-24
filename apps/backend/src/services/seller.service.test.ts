import test from 'node:test';
import assert from 'node:assert/strict';
import { decryptSellerApplication } from './seller.service.js';
import { encryptText } from '@/utils/encryption.js';

test('decryptSellerApplication returns decrypted reason and admin notes', () => {
  const app = {
    id: 'app-1',
    reason: encryptText('Quiero vender ganado'),
    adminNotes: encryptText('Revisión manual'),
    farmLocationLat: encryptText('10.5'),
    farmLocationLng: encryptText('-66.9'),
    farmLocationAddress: encryptText('La Victoria'),
  };

  const decrypted = decryptSellerApplication(app);

  assert.equal(decrypted.reason, 'Quiero vender ganado');
  assert.equal(decrypted.adminNotes, 'Revisión manual');
  assert.equal(decrypted.farmLocationAddress, 'La Victoria');
});
