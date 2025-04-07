const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

// 创建输出目录
const distDir = 'dist';
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// 创建一个文件来写入
const output = fs.createWriteStream(path.join(distDir, 'extension.zip'));
const archive = archiver('zip', {
    zlib: { level: 9 } // 设置最大压缩级别
});

// 监听所有存档数据都已被写入底层流
output.on('close', () => {
    console.log('Extension has been packaged successfully!');
    console.log(`Total bytes: ${archive.pointer()}`);
});

// 监听警告和错误
archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
        console.warn(err);
    } else {
        throw err;
    }
});

archive.on('error', (err) => {
    throw err;
});

// 将输出流pipe到文件
archive.pipe(output);

// 添加文件
archive.file('manifest.json', { name: 'manifest.json' });
archive.file('content.js', { name: 'content.js' });
archive.file('background.js', { name: 'background.js' });
archive.file('utils.js', { name: 'utils.js' });

// 完成打包
archive.finalize(); 