#!/usr/bin/env node

console.log(111)
import inquirer from 'inquirer';
import fs from 'fs';
import fg from 'fast-glob';
import path from 'path';
// @ts-expect-error
import sharp from 'sharp'

const questions = [
  {
    type: 'input',
    name: 'entryFile',
    message: "What's your entryfile path example: E:/test/images/*",
  },
  {
    type: 'list',
    message: 'img format',
    name: 'format',
    choices: [
      {
        name: 'png',
      },
      {
        name: 'jpeg',
      },
      {
        name: 'webp',
      },
    ]
  },
  {
    type: 'input',
    name: 'outputPath',
    message: "What's your outfile path example: E:/test/images2",
  },
  {
    type: 'number',
    name: 'quality',
    message: "compression quality (String Number 60 - 100)"
  }
  
]
inquirer.prompt(questions).then(async(answers:any) => {
  console.log(answers);
  const {entryFile,outputPath,format,quality} = answers
  // const entries = await fg(entryFile, { dot: true });
  // const files = fs.readdirSync(entryFile);
  console.log('files:', answers)
  batSharp({entryFile,format,outputPath,outputConfig:{quality}})
});





interface IOptions {
  entryFile: string
  format: string
  outputPath: string
  outputConfig?: Object
}

const getFileName = (path: string) => {
    // console.log(path)
    // console.log(path.replace(/(.*\/)*([^.]+).*/gi, '$2'))
  return path.replace(/(.*\/)*([^.]+).*/gi, '$2')
}

export const batSharp = async (options: IOptions) => {
  console.log('input',options)
  const {
    entryFile = '',
    format = 'png',
    outputPath,
    outputConfig = {},
  } = options || {}

  // if (!outputPath  || !format)
  //   return
  const entries = await fg([entryFile], { dot: true })
  // const entries = fs.readdirSync(entryFile);

  console.log('fileList: ', entries)
  const isExist = fs.existsSync(path.normalize(outputPath))
  if (!isExist)
    fs.mkdirSync(outputPath)

  let isAllSucc = true
  for (const filePath of entries) {
    const targetPath = path.join(outputPath, `${getFileName(filePath)}.${format}`)
    console.log('targetPath',targetPath)
    sharp(filePath)[format](outputConfig)
      .toFile(`${targetPath}`, (err: string) => {
        if (err)
          isAllSucc = false
      })
  }
  if (isAllSucc)
    console.log('处理完成')
}

// 测试demo
// batSharp({
//   inputArr: ['./images/*.png'],
//   format: 'jpg',
//   outputPath: './images2/',
//   outputConfig: {
//     quality: 80,
//   },
// })
