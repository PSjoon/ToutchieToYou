import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const name of ['index.html','config.js','.nojekyll']) await copyFile(name,'dist/'+name);
for(const name of ['assets','data']) await cp(name,'dist/'+name,{recursive:true});
console.log('Site pronto em dist/');
