import Schema from '../lib/schema/schema';
import Entity from '../lib/entity/entity';

describe("Schema", () => {

  describe("that is empty", () => {

    interface TestEntity {}
    class TestEntity extends Entity {}

    let schema: Schema<TestEntity>;

    beforeAll(() => schema = new Schema<TestEntity>(TestEntity, {}));
    
    it("has the constructor for the entity",
      () => expect(schema.entityCtor).toBe(TestEntity));
      
    it("generates the keyspace prefix from the entity constructor name",
      () => expect(schema.prefix).toBe("TestEntity"));

    it("generates default Redis IDs", () => {
      let id = schema.generateId();
      expect(id).toHaveLength(22);
      expect(id).toMatch(/^[A-Za-z0-9+/]{22}$/);
    });
  });

  describe("that overrides the keyspace prefix", () => {

    interface TestEntity {}
    class TestEntity extends Entity {}

    let subject: Schema<TestEntity>;

    beforeAll(() => subject = new Schema<TestEntity>(TestEntity, {}, { prefix: 'test-prefix' }));
    
    it("generates the keyspace prefix from the configuration",
      () => expect(subject.prefix).toBe("test-prefix"));
  });

  describe("that overrides the id generation strategy", () => {

    interface TestEntity {}
    class TestEntity extends Entity {}

    let subject: Schema<TestEntity>;

    beforeAll(() => {
      subject = new Schema<TestEntity>(TestEntity, {}, {
        idStrategy: () => '1'
      });
    })

    it("generates Redis IDs from the strategy", () => {
      let id = subject.generateId();
      expect(id).toBe('1');
    });
  });

  describe("that defines a number", () => {

    interface TestEntity {
      aNumber: number;
    }

    class TestEntity extends Entity {}

    let subject: Schema<TestEntity>;
    let entity: TestEntity;

    beforeAll(() => {
      subject = new Schema<TestEntity>(TestEntity, {
        aNumber: { type: 'number' }
      });
    });

    beforeEach(() => entity = new TestEntity('foo', { aNumber: '42' }));

    it("adds the getter and setter for a numeric field from the schema definition to the entity", () => {
      expect(entity).toHaveProperty('aNumber', 42);
      entity.aNumber = 23;
      expect(entity.aNumber).toBe(23);
    });
  });

  describe("that defines a string", () => {

    interface TestEntity {
      aString: string;
    }

    class TestEntity extends Entity {}

    let subject: Schema<TestEntity>;
    let entity: TestEntity;

    beforeAll(() => {
      subject = new Schema<TestEntity>(TestEntity, {
        aString: { type: 'string' }
      });
    });
    
    beforeEach(() => entity = new TestEntity('foo', { aString: 'foo' }));

    it("adds the getter and setter for a text field from the schema definition to the entity", () => {
      expect(entity).toHaveProperty('aString', 'foo');
      entity.aString = 'baz';
      expect(entity.aString).toBe('baz');
    });
  });

  describe("that defines a boolean", () => {

    interface TestEntity {
      aBoolean: boolean;
    }

    class TestEntity extends Entity {}

    let subject: Schema<TestEntity>;
    let entity: TestEntity;

    beforeAll(() => {
      subject = new Schema<TestEntity>(TestEntity, {
        aBoolean: { type: 'boolean' }
      });
    });

    beforeEach(() => entity = new TestEntity('foo', { aBoolean: '1' }));

    it("adds the getter and setter for a tag field from the schema definition to the entity", () => {
      expect(entity).toHaveProperty('aBoolean', true);
      entity.aBoolean = false;
      expect(entity.aBoolean).toBe(false);
    });
  });
});
