import { fetchJson } from '../helpers/redis-helper';
import { JsonEntity, AN_ENTITY, A_PARTIAL_ENTITY, AN_EMPTY_ENTITY, createJsonEntitySchema, loadTestJson, ANOTHER_ENTITY, A_THIRD_ENTITY} from '../helpers/data-helper';

import Client from '../../lib/client';
import Schema from '../../lib/schema/schema'
import Repository from '../../lib/repository/repository';

import { EntityId, EntityKey } from '../../lib/entity/entity-types';

describe("update JSON", () => {

  let client: Client;
  let repository: Repository<JsonEntity>;
  let schema: Schema<JsonEntity>;
  let entity: JsonEntity;
  let entityId: EntityId;
  let entityKey: EntityKey;

  beforeAll(async () => {
    client = new Client();
    await client.open();

    schema = createJsonEntitySchema();
    repository = client.fetchRepository<JsonEntity>(schema);
  });
  
  beforeEach(async () => {
    await client.execute(['FLUSHALL']);
    await loadTestJson(client, 'JsonEntity:full', AN_ENTITY);
  });

  afterAll(async () => await client.close());

  describe("when updating a fully populated entity to redis", () => {
    beforeEach(async () => {
      entity = await repository.fetch('full');
      entity.aString = ANOTHER_ENTITY.aString;
      entity.anotherString = ANOTHER_ENTITY.anotherString;
      entity.aFullTextString = ANOTHER_ENTITY.aFullTextString;
      entity.anotherFullTextString = ANOTHER_ENTITY.anotherFullTextString;
      entity.aNumber = ANOTHER_ENTITY.aNumber;
      entity.anotherNumber = ANOTHER_ENTITY.anotherNumber;
      entity.aBoolean = ANOTHER_ENTITY.aBoolean;
      entity.anotherBoolean = ANOTHER_ENTITY.anotherBoolean;
      entity.anArray = ANOTHER_ENTITY.anArray;
      entity.anotherArray = ANOTHER_ENTITY.anotherArray;
      entityId = await repository.save(entity);
      entityKey = `JsonEntity:full`;
    });

    it("returns the expected entity id", () => expect(entityId).toBe('full'));

    it("creates the expected JSON", async () => {
      let json = await fetchJson(client, entityKey);
      let data = JSON.parse(json);
      expect(data.aString).toBe(ANOTHER_ENTITY.aString);
      expect(data.anotherString).toBe(ANOTHER_ENTITY.anotherString);
      expect(data.aFullTextString).toBe(ANOTHER_ENTITY.aFullTextString);
      expect(data.anotherFullTextString).toBe(ANOTHER_ENTITY.anotherFullTextString);
      expect(data.aNumber).toBe(ANOTHER_ENTITY.aNumber);
      expect(data.anotherNumber).toBe(ANOTHER_ENTITY.anotherNumber);
      expect(data.aBoolean).toBe(ANOTHER_ENTITY.aBoolean);
      expect(data.anotherBoolean).toBe(ANOTHER_ENTITY.anotherBoolean);
      expect(data.anArray).toBe(ANOTHER_ENTITY.anArray?.join('|'));
      expect(data.anotherArray).toBe(ANOTHER_ENTITY.anotherArray?.join('|'));
    });
  });

  describe("when updating a partially populated entity to redis", () => {
    beforeEach(async () => {
      entity = await repository.fetch('full');
      entity.aString = ANOTHER_ENTITY.aString;
      entity.anotherString = null;
      entity.aFullTextString = ANOTHER_ENTITY.aFullTextString;
      entity.anotherFullTextString = null;
      entity.aNumber = ANOTHER_ENTITY.aNumber;
      entity.anotherNumber = null;
      entity.aBoolean = ANOTHER_ENTITY.aBoolean;
      entity.anotherBoolean = null;
      entity.anArray = ANOTHER_ENTITY.anArray;
      entity.anotherArray = null;
      entityId = await repository.save(entity);
      entityKey = `JsonEntity:full`;
    });

    it("returns the expected entity id", () => expect(entityId).toBe('full'));

    it("creates the expected JSON", async () => {
      let json = await fetchJson(client, entityKey);
      let data = JSON.parse(json);
      expect(data.aString).toBe(ANOTHER_ENTITY.aString);
      expect(data.anotherString).toBeNull()
      expect(data.aFullTextString).toBe(ANOTHER_ENTITY.aFullTextString);
      expect(data.anotherFullTextString).toBeNull();
      expect(data.aNumber).toBe(ANOTHER_ENTITY.aNumber);
      expect(data.anotherNumber).toBeNull();
      expect(data.aBoolean).toBe(ANOTHER_ENTITY.aBoolean);
      expect(data.anotherBoolean).toBeNull();
      expect(data.anArray).toBe(ANOTHER_ENTITY.anArray?.join('|'));
      expect(data.anotherArray).toBeNull();
    });
  });

  describe("when updating an empty entity to redis", () => {
    beforeEach(async () => {
      entity = await repository.fetch('full');
      entity.aString = null;
      entity.anotherString = null;
      entity.aFullTextString = null;
      entity.anotherFullTextString = null;
      entity.aNumber = null;
      entity.anotherNumber = null;
      entity.aBoolean = null;
      entity.anotherBoolean = null;
      entity.anArray = null;
      entity.anotherArray = null;
      entityId = await repository.save(entity);
      entityKey = `JsonEntity:full`;
    });

    it("returns the expected entity id", () => expect(entityId).toBe('full'));

    it("creates the expected JSON", async () => {
      let json = await fetchJson(client, entityKey);
      let data = JSON.parse(json);
      expect(data.aString).toBeNull();
      expect(data.anotherString).toBeNull()
      expect(data.aFullTextString).toBeNull();
      expect(data.anotherFullTextString).toBeNull();
      expect(data.aNumber).toBeNull();
      expect(data.anotherNumber).toBeNull();
      expect(data.aBoolean).toBeNull();
      expect(data.anotherBoolean).toBeNull();
      expect(data.anArray).toBeNull();
      expect(data.anotherArray).toBeNull();
    });
  });
});
