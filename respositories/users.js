const fs = require('fs');
const crypto = require('crypto');

class UsersRepository {
    constructor(filename) {
        if (!filename){
            throw new Error('Creating a repository requires a filename');
        } 

        this.filename = filename;

        try{
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]')
        }
       
    }

    async getAll() {
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));

    }

    async create(attrs) {
        attrs.id = this.randomId();
        
        const records = await this.getAll(); //to get the most up to date list of users
        records.push(attrs);

        await this.writeAll(records);
    }

    async writeAll(records){
        await fs.promises.writeFile(this.filename, JSON.stringify(records));
    }

    randomId(){
        return crypto.randomBytes(4).toString('hex');
    }
}

const test = async () => {
    const repo = new UsersRepository('users.json');

    await repo.getAll();
};

test();
