from setuptools import setup, find_packages

setup(
    name="blog_generator",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "python-dotenv",
        "chromadb",
        "sentence-transformers",
        "openai",
        "pytest",
        "pytest-asyncio"
    ]
)
