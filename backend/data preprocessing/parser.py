import time

import pandas as pd
from ChromeDriverDir import CHROME
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By

service = Service(executable_path=CHROME)
driver = webdriver.Chrome(service=service)

data = []

for number_of_page in range(1, 15):

    # page = f'https://www.kinopoisk.ru/lists/movies/country--2/?ss_subscription=ANY&b=films&page={number_of_page}'
    # page = f'https://www.kinopoisk.ru/lists/movies/country--13/?ss_subscription=ANY&b=films&page={number_of_page}'
    page = f'https://www.kinopoisk.ru/lists/movies/popular-films/?b=foreign&b=released&page={number_of_page}'

    driver.get(page)
    time.sleep(20)

    url = webdriver.Chrome(service=service)

    # для блока со ссылками
    class_name = "styles_root__wgbNq"
    blocks = driver.find_elements(By.CLASS_NAME, class_name)

    for i in range(len(blocks)):

        try:
            href = blocks[i].get_attribute("href")
            url.get(href)
            time.sleep(20)

            # Берем ссылку на постер
            try:
                poster = url.find_element(By.CLASS_NAME, 'styles_posterLink__C1HRc').find_element(By.TAG_NAME, 'img')
                poster_link = poster.get_attribute('src')
                #print(poster_link)
            except:
                poster_link = None
                print('Не взялась обложка')

            # Берем название фильма
            try:
                title_block = url.find_element(By.CLASS_NAME, 'styles_title__hTCAr').find_element(By.TAG_NAME,'h1')
                title_with_year = title_block.find_element(By.TAG_NAME, 'span').text
                title = title_with_year[:-7]
                year = title_with_year[-5:-1]
                # print(title)
                # print(year)

            except:
                title = None
                year = None
                print('Не взялось название')

            # Берем блок с инфо о фильме
            try:
                genre = ''
                director = ''
                duration = ''

                i = 1
                while genre == '' or director == '' or duration == '':
                    info_block = url.find_element(By.XPATH, f'//*[@id="__next"]/div[1]/div[2]/main/div[1]/div[2]/div/div[3]/div/div/div[3]/div[1]/div/div[{i}]')
                    info_elements = info_block.find_elements(By.TAG_NAME, 'div')

                    if info_elements[0].text == 'Жанр':
                        genre_blocks = info_elements[1].find_element(By.TAG_NAME, 'div').find_elements( By.TAG_NAME, 'a')
                        for block in genre_blocks:
                            genre += block.text
                            genre += ', '
                        genre = genre[:-2]
                        # print(genre)
                    elif info_elements[0].text == 'Режиссер':
                        director = info_elements[1].find_element(By.TAG_NAME, 'a').text
                        # print(director)
                    elif info_elements[0].text == 'Время':
                        duration = info_elements[1].find_element(By.TAG_NAME, 'div').text
                        # print(duration)

                    if i > 30:
                        print('тридцатка')
                        break
                    i += 1

            except:
                try:
                    genre = ''
                    director = ''
                    duration = ''

                    i = 1
                    while genre == '' or director == '' or duration == '':
                        info_block = url.find_element(By.XPATH,
                                                      f'//*[@id="__next"]/div[1]/div[2]/main/div[1]/div[2]/div/div[3]/div/div/div[2]/div[1]/div/div[{i}]')
                        info_elements = info_block.find_elements(By.TAG_NAME, 'div')

                        if info_elements[0].text == 'Жанр':
                            genre_blocks = info_elements[1].find_element(By.TAG_NAME, 'div').find_elements(By.TAG_NAME,
                                                                                                           'a')
                            for block in genre_blocks:
                                genre += block.text
                                genre += ', '
                            genre = genre[:-2]
                            # print(genre)
                        elif info_elements[0].text == 'Режиссер':
                            director = info_elements[1].find_element(By.TAG_NAME, 'a').text
                            # print(director)
                        elif info_elements[0].text == 'Время':
                            duration = info_elements[1].find_element(By.TAG_NAME, 'div').text
                            # print(duration)

                        if i > 30:
                            print('тридцатка')
                            break
                        i += 1
                except:
                    genre = None
                    director = None
                    duration = None
                    print('Инфо блок с ролями не взялся')

            # Берем двух главных актеров фильма
            try:
                actors_block = url.find_element(By.CLASS_NAME, 'styles_list___ufg4')
                first_two_actors = actors_block.find_elements(By.TAG_NAME, 'li')[:2]

                star1 = first_two_actors[0].find_element(By.TAG_NAME, 'a').text
                star2 = first_two_actors[1].find_element(By.TAG_NAME, 'a').text
                # print(star1, star2)
            except:
                star1 = None
                star2 = None
                print("Актеры не взялись")

            # Берем рейтинг
            try:
                rating_block = url.find_element(By.CLASS_NAME, 'styles_value__N2Vzt').find_element(By.TAG_NAME, 'span')
                rating = rating_block.find_element(By.TAG_NAME, 'span').text
                # print(rating)

            except:
                rating = None
                print('Рейтинг не взялся')


            # Берем описание фильма
            try:
               overview_blocks = url.find_elements(By.CLASS_NAME, 'styles_paragraph__wEGPz')

               overview = ''
               for el in overview_blocks:
                   overview += el.text
                   overview += ' '

               overview = overview[:-1]
               # print(overview)

            except:
                overview = None
                print('Описание не взялось')


            # формирование словаря для каждого объекта
            # data - массив, содержащий словари с данными

            dict_ = {'Poster_Link': poster_link,
                    'Series_Title': title,
                    'Released_Year': year,
                    'Runtime': duration,
                    'Genre': genre,
                    'Rating': rating,
                    'Overview' : overview,
                    'Director': director,
                    'Star1': star1,
                    'Star2' : star2
                    }
            print(dict_)

            data.append(dict_)

        except:
            print(f'Фильм {i} не взялся')
            pass

    url.close()

driver.close()
driver.quit()


# формирование dataframe из словаря, его запись в файл data.csv
Data_Frame = pd.DataFrame(data)
Data_Frame.to_csv('data.csv', sep=',', encoding='utf-8')