# Setup (how that was done)
```bash
cd proj
podman run -it --rm --name nj --volume .:/home/app localhost/simple-nodejs:alpha ash
```
inside _nj_
```sh
npx create-next-app@latest .
# 15.3.2
```

# Start
```bash
podman-compose up -d
```

# Sources
## main dataset
- [Program rewitalizacji Lublina (2017-23)](https://dane.gov.pl/pl/dataset/3717,program-rewitalizacji-dla-lublina-na-lata-2017-2023/resource/54913/table)

https://dane.gov.pl/pl/dataset/3718,strategia-rozwoju-turystyki-miasta-lublin-do-roku-2025/resource/54916/table

https://dane.gov.pl/pl/dataset/3643,c-3-1-instytucje-kultury-w-lublinie/resource/54739/table

https://dane.gov.pl/pl/dataset/3701,d-1-4-wydatki-na-kulture-w-przeliczeniu-na-jednego-mieszkanca/resource/54866/table

https://dane.gov.pl/pl/dataset/3712,d-1-2-liczba-uczestnikow-wybranych-wydarzen-kulturalnych-oraz-imprez-artystyczno/resource/54895/table

https://dane.gov.pl/pl/dataset/3740,strategia-rozwoju-kultury-lublina-na-lata-2013-2020/resource/54959/table

## additional dataset
- [Holidays](https://date.nager.at/api/v3/PublicHolidays/2017/AT)